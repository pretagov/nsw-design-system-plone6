import cx from 'classnames';
import { isEmpty, isEqual } from 'lodash';
import { readAsDataURL } from 'promise-file-reader';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Button, Dimmer, Loader, Message } from 'semantic-ui-react';

import { createContent } from '@plone/volto/actions';
import {
  BlockDataForm,
  BlocksForm,
  Icon,
  LinkMore,
  SidebarPortal,
} from '@plone/volto/components';
import {
  blockHasValue,
  deleteBlock,
  emptyBlocksForm,
  flattenToAppURL,
  getBaseUrl,
  isInternalURL,
} from '@plone/volto/helpers';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import config from '@plone/volto/registry';

import clearSVG from '@plone/volto/icons/clear.svg';

import Data from '@plone/volto/components/manage/Blocks/HeroImageLeft/Data';
import schemaHero from '@plone/volto/components/manage/Blocks/HeroImageLeft/schema';
import NewBlockAddButton from '../../../../../../components/Components/Helpers/NewBlockAddButton';
import Hero from '../../../../../../components/Components/Hero';

const messages = defineMessages({
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  description: {
    id: 'Description',
    defaultMessage: 'Description',
  },
  placeholder: {
    id: 'Upload a new image',
    defaultMessage: 'Upload a new image',
  },
  image: {
    id: 'Image',
    defaultMessage: 'Image',
  },
  browse: {
    id: 'Browse',
    defaultMessage: 'Browse',
  },
  uploading: {
    id: 'Uploading image',
    defaultMessage: 'Uploading image',
  },
});

class EditComponent extends Component {
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    block: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    content: PropTypes.objectOf(PropTypes.any),
    request: PropTypes.shape({
      loading: PropTypes.bool,
      loaded: PropTypes.bool,
    }).isRequired,
    pathname: PropTypes.string.isRequired,
    onChangeBlock: PropTypes.func.isRequired,
    onSelectBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
    onFocusPreviousBlock: PropTypes.func.isRequired,
    onFocusNextBlock: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired,
    createContent: PropTypes.func.isRequired,
    editable: PropTypes.bool,
  };

  static defaultProps = {
    editable: true,
  };

  setInitialData() {
    // TODO: Schema enhancer support
    // const enhancedSchema = applySchemaEnhancer(schema({ intl }), data);
    // const enhancedSchema = blockSchema ? blockSchema({ intl }) : null;
    const intl = this.props.intl;
    const enhancedSchema = this.blockSchema ? this.blockSchema({ intl }) : null;
    const defaultValues = Object.keys(enhancedSchema?.properties ?? {}).reduce(
      (accumulator, currentVal) => {
        return enhancedSchema.properties[currentVal].default
          ? {
              ...accumulator,
              [currentVal]: enhancedSchema.properties[currentVal].default,
            }
          : accumulator;
      },
      {},
    );

    return {
      ...defaultValues,
      ...this.props.data,
      block: {
        ...this.childBlockdata,
      },
    };
  }

  constructor(props) {
    super(props);

    const {
      block,
      data,
      selected,
      manage,
      onChangeBlock,
      onChangeField,
    } = props;

    // TODO: Make this configurable per-block
    const disallowedBlocks = ['nsw_section'];
    const defaultAllowedBlocks = Object.keys(config.blocks.blocksConfig).filter(
      (blockId) => {
        return !disallowedBlocks.includes(blockId);
      },
    );
    this.manage = manage;
    this.allowedBlocks = data.allowedBlocks || defaultAllowedBlocks;
    this.ownerBlockMetadata = props.metadata || props.properties;
    this.childBlockdata = isEmpty(data?.block?.blocks)
      ? emptyBlocksForm()
      : data.block;
    this.childBlockId = this.childBlockdata.blocks_layout?.items[0];
    this.ownerBlockID = block;
    this.onChangeBlock = onChangeBlock;
    this.onChangeField = onChangeField;
    this.toolbarRef = React.createRef();
    this.blockEditorRef = React.createRef();
    this.handleClickOutsideBlockEditor = this.handleClickOutsideBlockEditor.bind(
      this,
    );

    this.onUploadImage = this.onUploadImage.bind(this);
    this.state = {
      uploading: false,
      blockState: {},
      selectedBlock: this.ownerBlockID,
    };
    if (isEmpty(data.block)) {
      onChangeBlock(this.ownerBlockID, this.setInitialData());
    }

    const { Map } = this.props.immutableLib;

    if (!__SERVER__) {
      const { DefaultDraftBlockRenderMap, EditorState } = props.draftJs;
      const { stateFromHTML } = props.draftJsImportHtml;

      const blockTitleRenderMap = Map({
        unstyled: {
          element: 'h1',
        },
      });

      const blockDescriptionRenderMap = Map({
        unstyled: {
          element: 'div',
        },
      });

      this.extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(
        blockTitleRenderMap,
      );

      this.extendedDescripBlockRenderMap = DefaultDraftBlockRenderMap.merge(
        blockDescriptionRenderMap,
      );

      let titleEditorState;
      let descriptionEditorState;
      if (props.data && props.data.title) {
        titleEditorState = EditorState.createWithContent(
          stateFromHTML(props.data.title),
        );
      } else {
        titleEditorState = EditorState.createEmpty();
      }
      if (props.data && props.data.description) {
        descriptionEditorState = EditorState.createWithContent(
          stateFromHTML(props.data.description),
        );
      } else {
        descriptionEditorState = EditorState.createEmpty();
      }
      this.state = {
        uploading: false,
        titleEditorState,
        descriptionEditorState,
        currentFocused: 'title',
      };
    }

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
  }

  handleClickOutsideBlockEditor(event) {
    if (!this.props.blockNode.current?.contains(event.target)) {
      return;
    }
    if (this.toolbarRef.current?.contains(event.target)) {
      return;
    }
    if (this.blockEditorRef.current === null || !this.blockEditorRef.current) {
      this.setState({ selectedBlock: this.ownerBlockID });
    }
    if (!event.target) {
      this.setState({ selectedBlock: this.ownerBlockID });
    }
    if (this.blockEditorRef.current?.contains(event.target)) {
      this.setState({ selectedBlock: this.childBlockId });
    } else {
      this.setState({ selectedBlock: this.ownerBlockID });
    }
  }

  componentDidMount() {
    if (this.props.selected) {
      this.titleEditor.focus();
    }
    document.addEventListener(
      'mousedown',
      this.handleClickOutsideBlockEditor,
      false,
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      'mousedown',
      this.handleClickOutsideBlockEditor,
      false,
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props.request.loading &&
      nextProps.request.loaded &&
      this.state.uploading
    ) {
      this.setState({
        uploading: false,
      });
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        url: nextProps.content['@id'],
      });
    }

    const { EditorState } = this.props.draftJs;
    const { stateFromHTML } = this.props.draftJsImportHtml;

    if (
      nextProps.data.title &&
      this.props.data.title !== nextProps.data.title &&
      !this.props.selected
    ) {
      const contentState = stateFromHTML(nextProps.data.title);
      this.setState({
        titleEditorState: nextProps.data.title
          ? EditorState.createWithContent(contentState)
          : EditorState.createEmpty(),
      });
    }

    if (
      nextProps.data.description &&
      this.props.data.description !== nextProps.data.description &&
      !this.props.selected
    ) {
      const contentState = stateFromHTML(nextProps.data.description);
      this.setState({
        descriptionEditorState: nextProps.data.description
          ? EditorState.createWithContent(contentState)
          : EditorState.createEmpty(),
      });
    }

    if (!nextProps.selected) {
      this.titleEditor.editor.blur();
      this.descriptionEditor.editor.blur();
    }

    if (nextProps.selected && !this.props.selected) {
      if (this.state.currentFocused === 'title') {
        this.titleEditor.focus();
      } else {
        this.descriptionEditor.focus();
      }
    }
  }

  componentDidUpdate(prevProps) {}

  shouldComponentUpdate(nextProps) {
    return this.props.selected || !isEqual(this.props.data, nextProps.data);
  }

  onChangeTitle(titleEditorState) {
    this.setState({ titleEditorState }, () => {
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        title: titleEditorState.getCurrentContent().getPlainText(),
      });
    });
  }

  onChangeDescription(descriptionEditorState) {
    this.setState({ descriptionEditorState }, () => {
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        description: descriptionEditorState.getCurrentContent().getPlainText(),
      });
    });
  }

  onUploadImage({ target }) {
    const file = target.files[0];
    this.setState({
      uploading: true,
    });
    readAsDataURL(file).then((data) => {
      const fields = data.match(/^data:(.*);(.*),(.*)$/);
      this.props.createContent(
        getBaseUrl(this.props.pathname),
        {
          '@type': 'Image',
          image: {
            data: fields[3],
            encoding: fields[2],
            'content-type': fields[1],
            filename: file.name,
          },
        },
        this.props.block,
      );
    });
  }

  render() {
    if (__SERVER__) {
      return <div />;
    }
    const { Editor } = this.props.draftJs;
    const placeholder =
      this.props.data.placeholder ||
      this.props.intl.formatMessage(messages.placeholder);

    const variations =
      config.blocks.blocksConfig[this.props.data['@type']].variations;
    const variation = variations.find((item) => {
      return item.id === this.props.data.variation;
    });
    const linksList =
      this.props.data?.links?.map((linkItem) => {
        let href = linkItem.link && linkItem.link[0] && linkItem.link[0]['@id'];
        if (isInternalURL(href)) {
          href = flattenToAppURL(href);
        }
        return { title: linkItem.title, link: href };
      }) || [];

    return (
      <div
        className={cx('block hero', {
          selected: this.props.selected,
        })}
      >
        {this.props.selected &&
          this.props.editable &&
          !!(this.props.data.url || this.props.data.block) && (
            <div className="toolbar" ref={this.toolbarRef}>
              <Button.Group>
                <Button
                  icon
                  basic
                  onClick={() => {
                    if (this.state.selectedBlock === this.childBlockId) {
                      const [newBlockId, newBlockData] = deleteBlock(
                        this.childBlockdata,
                        this.childBlockId,
                      );
                      // Prepare the new child block before adding it to the section.
                      this.props.onChangeBlock(newBlockId, {
                        ...newBlockData.blocks[newBlockId],
                        fixed: true,
                        required: true,
                      });
                      this.props.onChangeBlock(this.ownerBlockID, {
                        ...this.props.data,
                        block: {
                          ...newBlockData,
                        },
                      });
                      this.childBlockId = newBlockId;
                    } else {
                      this.props.onChangeBlock(this.props.block, {
                        ...this.props.data,
                        url: '',
                      });
                    }
                  }}
                >
                  <Icon name={clearSVG} size="24px" color="#e40166" />
                </Button>
              </Button.Group>
            </div>
          )}
        <Hero
          // title={this.props.data.title}
          // description={this.props.data.description}
          imageUrl={null}
          linkTitle={this.props.data.linkTitle}
          linkHref={null}
          contentChildren={
            <>
              <Editor
                ref={(node) => {
                  this.titleEditor = node;
                }}
                readOnly={!this.props.editable}
                onChange={this.onChangeTitle}
                editorState={this.state.titleEditorState}
                blockRenderMap={this.extendedBlockRenderMap}
                handleReturn={() => true}
                placeholder={this.props.intl.formatMessage(messages.title)}
                blockStyleFn={() => 'title-editor'}
                onUpArrow={() => {
                  const selectionState = this.state.titleEditorState.getSelection();
                  const { titleEditorState } = this.state;
                  if (
                    titleEditorState
                      .getCurrentContent()
                      .getBlockMap()
                      .first()
                      .getKey() === selectionState.getFocusKey()
                  ) {
                    this.props.onFocusPreviousBlock(
                      this.props.block,
                      this.props.blockNode.current,
                    );
                  }
                }}
                onDownArrow={() => {
                  const selectionState = this.state.titleEditorState.getSelection();
                  const { titleEditorState } = this.state;
                  if (
                    titleEditorState
                      .getCurrentContent()
                      .getBlockMap()
                      .last()
                      .getKey() === selectionState.getFocusKey()
                  ) {
                    this.setState(() => ({ currentFocused: 'description' }));
                    this.descriptionEditor.focus();
                  }
                }}
              />
              <Editor
                ref={(node) => {
                  this.descriptionEditor = node;
                }}
                readOnly={!this.props.editable}
                onChange={this.onChangeDescription}
                editorState={this.state.descriptionEditorState}
                blockRenderMap={this.extendedDescripBlockRenderMap}
                handleReturn={() => true}
                placeholder={this.props.intl.formatMessage(
                  messages.description,
                )}
                blockStyleFn={() => 'description-editor'}
                onUpArrow={() => {
                  const selectionState = this.state.descriptionEditorState.getSelection();
                  const currentCursorPosition = selectionState.getStartOffset();

                  if (currentCursorPosition === 0) {
                    this.setState(() => ({ currentFocused: 'title' }));
                    this.titleEditor.focus();
                  }
                }}
                onDownArrow={() => {
                  const selectionState = this.state.descriptionEditorState.getSelection();
                  const { descriptionEditorState } = this.state;
                  const currentCursorPosition = selectionState.getStartOffset();
                  const blockLength = descriptionEditorState
                    .getCurrentContent()
                    .getFirstBlock()
                    .getLength();

                  if (currentCursorPosition === blockLength) {
                    this.props.onFocusNextBlock(
                      this.props.block,
                      this.props.blockNode.current,
                    );
                  }
                }}
              />
              {this.props.data.linkHref && this.props.data.linkTitle ? (
                <div className="nsw-hero-banner__button">
                  <span className=" nsw-button nsw-button--white">
                    {this.props.data.linkTitle}
                  </span>
                </div>
              ) : null}
              {this.props.selected ? (
                <div className="toolbar">{this.props.ToolbarButtons}</div>
              ) : null}
              {variation && variation.id === 'heroWithBlocks' ? (
                <div className="nsw-m-top-md">
                  {this.props.data.block &&
                  blockHasValue(
                    this.props.data?.block.blocks[this.childBlockId],
                  ) ? (
                    // We need the div to set the ref on a custom component
                    <div ref={this.blockEditorRef}>
                      <BlocksForm
                        key={this.childBlockId}
                        title={this.props.data.placeholder}
                        manage={this.props.manage}
                        allowedBlocks={this.allowedBlocks}
                        metadata={{
                          ...this.ownerBlockMetadata,
                          disableNewBlocks: true,
                        }}
                        properties={this.childBlockdata}
                        selectedBlock={
                          this.props.selected ? this.state.selectedBlock : null
                        }
                        onSelectBlock={(id) => {
                          this.setState({ selectedBlock: id });
                        }}
                        disableNewBlocks={true}
                        onChangeFormData={(newFormData) => {
                          this.props.onChangeBlock(this.ownerBlockID, {
                            ...this.props.data,
                            block: {
                              ...this.props.data.block,
                              ...newFormData,
                            },
                          });
                        }}
                        onChangeField={(id, value) => {
                          if (['blocks', 'blocks_layout'].indexOf(id) > -1) {
                            this.setState({
                              blockState: {
                                ...this.state.blockState,
                                [id]: value,
                              },
                            });
                            this.props.onChangeBlock(this.ownerBlockID, {
                              ...this.props.data,
                              data: {
                                blocks: {
                                  [this.childBlockId]: {
                                    ...this.state.blockState,
                                  },
                                },
                              },
                            });
                          } else {
                            this.props.onChangeField(id, value);
                          }
                        }}
                        pathname={this.props.pathname}
                      />
                    </div>
                  ) : (
                    <NewBlockAddButton
                      inverted={true}
                      block={this.childBlockId}
                      onChangeBlock={(block, newValues) => {
                        const newBlock = {
                          ...this.props.data.block.blocks[block],
                          ...newValues,
                        };
                        const childBlockdata = {
                          ...this.props.data.block,
                          blocks: {
                            ...this.props.data.block.blocks,
                            [block]: newBlock,
                          },
                        };
                        this.props.onChangeBlock(this.ownerBlockID, {
                          ...this.props.data,
                          block: childBlockdata,
                        });
                        // TODO: This hidden state is such a mess :(
                        this.childBlockdata = childBlockdata;
                      }}
                      allowedBlocks={this.allowedBlocks}
                    />
                  )}
                </div>
              ) : null}
            </>
          }
          boxChildren={
            variation && variation.id === 'heroWithLinks' ? (
              <div class="nsw-hero-banner__links">
                <div class="nsw-hero-banner__list">
                  {this.props.data.linksTitle ? (
                    <div class="nsw-hero-banner__sub-title">
                      {this.props.data.linksTitle}
                    </div>
                  ) : null}
                  <ul>
                    {linksList.map((linkItem) => {
                      return (
                        <li key={linkItem.title}>
                          <a href={linkItem.link}>{linkItem.title}</a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ) : this.props.data.url ? (
              <img
                src={`${flattenToAppURL(this.props.data.url)}/@@images/image`}
                alt=""
              />
            ) : (
              <div className="image-add" style={{ width: '100%' }}>
                <Message style={{ height: '100%', minHeight: '100px' }}>
                  {this.state.uploading && (
                    <Dimmer active>
                      <Loader indeterminate>
                        {this.props.intl.formatMessage(messages.uploading)}
                      </Loader>
                    </Dimmer>
                  )}
                  <center>
                    <h4>{this.props.intl.formatMessage(messages.image)}</h4>
                    {this.props.editable && (
                      <>
                        <p>{placeholder}</p>
                        <p>
                          <label className="nsw-button nsw-button--dark">
                            {this.props.intl.formatMessage(messages.browse)}
                            <input
                              type="file"
                              onChange={this.onUploadImage}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </p>
                      </>
                    )}
                  </center>
                </Message>
              </div>
            )
          }
        />
        <SidebarPortal selected={this.props.selected}>
          {/* TODO: Text editing in here causes focus loss after each character. */}
          <BlockDataForm
            schema={schemaHero({ ...this.props, intl: this.props.intl })}
            title="Hero block"
            onChangeField={(id, value) => {
              this.props.onChangeBlock(this.ownerBlockID, {
                ...this.props.data,
                [id]: value,
              });
            }}
            formData={this.props.data}
            block={this.ownerBlockID}
          />
        </SidebarPortal>
      </div>
    );
  }
}

const Edit = injectLazyLibs(['draftJs', 'immutableLib', 'draftJsImportHtml'])(
  EditComponent,
);

export default compose(
  injectIntl,
  connect(
    (state, ownProps) => ({
      request: state.content.subrequests[ownProps.block] || {},
      content: state.content.subrequests[ownProps.block]?.data,
    }),
    { createContent },
  ),
)(Edit);

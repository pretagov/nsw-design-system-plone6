import { Facets } from '@plone/volto/components/manage/Blocks/Search/components';
import cx from 'classnames';
import { flushSync } from 'react-dom';

const FacetWrapper = ({ children }) => (
  <div className="nsw-filters__item">{children}</div>
);

function FilterClearButton() {
  return (
    <div className="nsw-filters__cancel">
      <button type="reset">Clear all filters</button>
    </div>
  );
}

function FilterTitleDisplay({ title }) {
  return <div className="nsw-filters__title">{title}</div>;
}

export function Filters({
  data,
  querystring,
  liveUpdate = false,
  setFacets = () => {},
  onTriggerSearch = () => {},
  searchedText,
}) {
  const { facets, facetsTitle } = data;

  if (!facets || Object.keys(facets).length < 1) {
    return null;
  }

  return (
    <>
      <div className="nsw-filters nsw-filters--instant">
        <div className="nsw-filters__wrapper">
          <FilterTitleDisplay title={facetsTitle} />
          <div className="nsw-filters__list">
            <div className="nsw-filters__item">
              <div className="nsw-filters__item-content">
                <label
                  className="nsw-form__label"
                  for="filters-instant-regions-1"
                >
                  Region
                </label>
                <select
                  className="nsw-form__select"
                  name="filters-instant-regions-1"
                  id="filters-instant-regions-1"
                >
                  <option value="">Please select</option>
                  <option value="Central Coast">Central Coast</option>
                  <option value="Central West &amp; Orana">
                    Central West &amp; Orana
                  </option>
                  <option value="Far West">Far West</option>
                  <option value="Hunter">Hunter</option>
                  <option value="Illawarra-Shoalhaven">
                    Illawarra-Shoalhaven
                  </option>
                  <option value="New England &amp; North West">
                    New England &amp; North West
                  </option>
                  <option value="North Coast">North Coast</option>
                  <option value="Riverina Murray">Riverina Murray</option>
                </select>
              </div>
            </div>
            <div className="nsw-filters__item">
              <div className="nsw-filters__item-content">
                <fieldset className="nsw-form__fieldset">
                  <legend className="nsw-form__legend">Categories</legend>
                  <input
                    className="nsw-form__checkbox-input"
                    type="checkbox"
                    name="filters-instant-categories"
                    value="Customer Service"
                    id="filters-instant-categories-0-1"
                  />
                  <label
                    className="nsw-form__checkbox-label"
                    for="filters-instant-categories-0-1"
                  >
                    Customer Service
                  </label>
                  <input
                    className="nsw-form__checkbox-input"
                    type="checkbox"
                    name="filters-instant-categories"
                    value="Communities and Justice"
                    id="filters-instant-categories-1-1"
                  />
                  <label
                    className="nsw-form__checkbox-label"
                    for="filters-instant-categories-1-1"
                  >
                    Communities and Justice
                  </label>
                  <input
                    className="nsw-form__checkbox-input"
                    type="checkbox"
                    name="filters-instant-categories"
                    value="Education"
                    id="filters-instant-categories-2-1"
                  />
                  <label
                    className="nsw-form__checkbox-label"
                    for="filters-instant-categories-2-1"
                  >
                    Education
                  </label>
                  <input
                    className="nsw-form__checkbox-input"
                    type="checkbox"
                    name="filters-instant-categories"
                    value="Health"
                    id="filters-instant-categories-3-1"
                  />
                  <label
                    className="nsw-form__checkbox-label"
                    for="filters-instant-categories-3-1"
                  >
                    Health
                  </label>
                  <input
                    className="nsw-form__checkbox-input"
                    type="checkbox"
                    name="filters-instant-categories"
                    value="Planning"
                    id="filters-instant-categories-4-1"
                  />
                  <label
                    className="nsw-form__checkbox-label"
                    for="filters-instant-categories-4-1"
                  >
                    Planning
                  </label>
                </fieldset>
              </div>
            </div>
          </div>
          <FilterClearButton />
        </div>
      </div>

      <div
        className={cx('nsw-filters', { 'nsw-filters--instant': liveUpdate })}
      >
        <div className="nsw-filters__wrapper">
          <FilterTitleDisplay title={facetsTitle} />
          <Facets
            querystring={querystring}
            data={data}
            facets={facets}
            setFacets={(f) => {
              flushSync(() => {
                setFacets(f);
                onTriggerSearch(searchedText || '', f);
              });
            }}
            facetWrapper={FacetWrapper}
          />
          <FilterClearButton />
        </div>
      </div>
    </>
  );
}

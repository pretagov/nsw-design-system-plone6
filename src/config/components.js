import { EmbedContentViewWrapper } from 'nsw-design-system-plone6/components/EmbedContentViewWrapper';

export default function updateComponentRegistryConfig(config) {
  config.registerComponent({
    name: 'EmbedContentViewWrapper',
    component: EmbedContentViewWrapper,
  });
}

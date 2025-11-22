import cx from 'classnames';

// TODO: Support local videos other than mp4 files
export function Media({
  src,
  size,
  align,
  caption,
  captionBackgroundColour,
  isVideo,
  placeholder,
}) {
  const actuallyVideo =
    isVideo !== undefined
      ? isVideo
      : ['https://player.vimeo.com', 'youtube.com', '.mp4'].some((source) =>
          src.includes(source),
        );
  const videoIsLocal =
    actuallyVideo && ['.mp4'].some((source) => src.includes(source));

  return (
    <>
      <figure
        className={cx('nsw-media', {
          [`nsw-media--${captionBackgroundColour}`]: !!captionBackgroundColour,
          [`nsw-media--${size}`]:
            !!size &&
            !['left', 'right'].includes(align) &&
            size !== 'fullWidth',
          [`nsw-media--${align}-${size}`]:
            !!size && !!align && size !== 'fullWidth',
          'nsw-media__video': actuallyVideo,
        })}
      >
        {actuallyVideo ? (
          videoIsLocal ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              // Style tag is needed for sizing. See https://github.com/digitalnsw/nsw-design-system/pull/252
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100$',
                height: '100%',
              }}
              src={src}
              controls
              poster={placeholder}
              type="video/mp4"
            />
          ) : (
            <iframe
              src={src}
              title="NSW Digital Strategy introduction video"
              style={{ border: 0 }}
              allowfullscreen
            ></iframe>
          )
        ) : (
          <img src={src} alt="black dog" />
        )}

        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  );
}

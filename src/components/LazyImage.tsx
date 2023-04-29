import React, { Fragment, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { ReactComponent as GalleryIcon } from "assets/icons/gallery.svg";

interface ILazyImage {
  src: string;
  alt?: string;
}

const LazyImage: React.FC<ILazyImage> = ({ alt, src }) => {
  const [isError, setIsError] = useState(false);
  return (
    <Fragment>
      {!isError && src !== undefined ? (
        <LazyLoadImage
          src={src}
          alt={alt ?? ""}
          onError={() => setIsError(true)}
          effect="blur"
          className="lazy_load_nft_image"
        />
      ) : (
        <div className="no_image">
          <GalleryIcon />
        </div>
      )}
    </Fragment>
  );
};

export default React.memo(LazyImage);

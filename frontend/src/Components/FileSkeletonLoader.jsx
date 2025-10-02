import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const FileSkeletonLoader = ({ fileType }) => {
  console.log(fileType);

  const renderSkeleton = () => {
    switch (fileType) {
      case "image":
        return (
          <div className="max-w-4xl mx-auto">
            <Skeleton height={400} className="mb-4" />
            <Skeleton height={40} width={200} className="mb-4" />
            <Skeleton height={40} width={100} />
          </div>
        );
      case "pdf":
        return (
          <div className="max-w-4xl mx-auto">
            <Skeleton height={600} className="mb-4" />
            <Skeleton height={40} width={200} className="mb-4" />
            <Skeleton height={40} width={100} />
          </div>
        );
      case "audio":
        return (
          <div className="max-w-4xl mx-auto">
            <Skeleton height={100} className="mb-4" />
            <Skeleton height={40} width={200} className="mb-4" />
            <Skeleton height={40} width={100} />
          </div>
        );
      case "video":
        return (
          <div className="max-w-4xl mx-auto">
            <Skeleton height={400} className="mb-4" />
            <Skeleton height={40} width={200} className="mb-4" />
            <Skeleton height={40} width={100} />
          </div>
        );
      case "text":
      case "code":
        return (
          <div className="max-w-4xl mx-auto">
            <Skeleton height={400} className="mb-4" />
            <Skeleton height={40} width={200} className="mb-4" />
            <Skeleton height={40} width={100} />
          </div>
        );
      default:
        return (
          <div className="max-w-4xl mx-auto">
            <Skeleton height={200} className="mb-4" />
            <Skeleton height={40} width={200} className="mb-4" />
            <Skeleton height={40} width={100} />
          </div>
        );
    }
  };

  return <>{renderSkeleton()}</>;
};

export default FileSkeletonLoader;

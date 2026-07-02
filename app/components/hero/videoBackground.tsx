"use client";

import Video from "@ui/video/Video";
import styles from "./videoBackground.module.css";
import { MouseEventHandler } from "react";

export default function VideoBackground() {
  const handleOnLoadData = () => console.log("xxx");
  const handleContextMenu: MouseEventHandler<HTMLVideoElement> = (e) =>
    e.preventDefault();

  return (
    <>
      <Video
        loop
        autoPlay
        muted
        onContextMenu={handleContextMenu}
        onLoadedData={handleOnLoadData}
        className={styles.videoBanner}
        primarySrc="/videos/test.mp4"
        primarySrcType="video/mp4"
        isDefaultStyles={false}
      />
      <div className={styles.overlay} />
    </>
  );
}

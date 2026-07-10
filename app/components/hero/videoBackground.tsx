"use client";

import Video from "@ui/video/Video";
import styles from "./videoBackground.module.css";
import { VIDEO } from "./hero.constants";
import {
  MouseEventHandler,
  RefObject,
  useEffect,
  useRef,
  VideoHTMLAttributes,
} from "react";

interface VideoObjProps extends VideoHTMLAttributes<HTMLVideoElement> {
  primarySrc: string;
  primarySrcType: string;
  isDefaultStyles?: boolean;
  ref?: RefObject<HTMLVideoElement | null>;
}

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleMotionChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        return videoRef.current?.pause();
      }
      videoRef.current?.play();
    };

    motionQuery.addEventListener("change", handleMotionChange);

    return () => motionQuery.removeEventListener("change", handleMotionChange);
  }, []);

  const handleContextMenu: MouseEventHandler<HTMLVideoElement> = (e) =>
    e.preventDefault();

  const videoPropsObj: VideoObjProps = {
    loop: true,
    autoPlay: true,
    muted: true,
    onContextMenu: handleContextMenu,
    className: styles.videoBanner,
    isDefaultStyles: false,
    ref: videoRef,
    ...VIDEO,
  };

  return (
    <>
      <Video {...videoPropsObj} />
      <div className={styles.overlay} />
    </>
  );
}

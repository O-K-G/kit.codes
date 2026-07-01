import { SourceHTMLAttributes, VideoHTMLAttributes } from "react";
import styles from "./video.module.css";
import { concatStyles } from "@utils/concatStyles";

interface VideoProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, "src" | "type"> {
  primarySrc: SourceHTMLAttributes<HTMLSourceElement>["src"];
  backupSrc?: SourceHTMLAttributes<HTMLSourceElement>["src"];
  primarySrcType: SourceHTMLAttributes<HTMLSourceElement>["type"];
  backupSrcType?: SourceHTMLAttributes<HTMLSourceElement>["type"];
  isDefaultStyles?: boolean;
}

export default function Video({
  isDefaultStyles = true,
  primarySrc,
  primarySrcType,
  backupSrc,
  backupSrcType,
  className = "",
  ...rest
}: VideoProps) {
  const classNameString = concatStyles([styles.videoComponent, className]);

  return (
    <video
      data-default-styles={isDefaultStyles}
      className={classNameString}
      {...rest}
    >
      <source src={primarySrc} type={primarySrcType} />
      {backupSrc && <source src={backupSrc} type={backupSrcType} />}
    </video>
  );
}

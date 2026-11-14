import { ReactNode } from "react";
import LoaderVisibility from "@ui/loader/LoaderVisibility";
import {
  BoltProps,
  CogwheelProps,
  LoaderProps,
  LoaderTextProps,
} from "@constants/interfaces";
import styles from "./Loader.module.css";
import classNames from "@utils/classNames";

export const LOADER_TEST_ID = "loader-test";

function Cogwheel({
  sizeClassName = styles.size24,
  children,
  childrenClassName,
  bgClassName = styles.blue,
  className,
  "data-testid": dataTestId,
}: CogwheelProps) {
  const cogwheelClassName = classNames(styles.cogwheelPart, bgClassName);

  return (
    <div
      data-testid={dataTestId}
      className={classNames(styles.cogwheel, sizeClassName, className)}
    >
      <div className={cogwheelClassName} />
      <div className={classNames(cogwheelClassName, styles.cogwheelPartRotated)}>
        <div className={classNames(styles.cogwheelCenter, childrenClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Bolt({ centerPointClassName }: BoltProps) {
  return (
    <div className={styles.bolt}>
      <div>
        <div className={classNames(styles.boltCenter, centerPointClassName)} />
      </div>
    </div>
  );
}

function LoaderText({ label, slot }: LoaderTextProps) {
  if (label ?? slot) {
    return (
      <div className={styles.textContainer}>
        <div className={styles.text}>
          {label}
        </div>
        {slot}
      </div>
    );
  }
}

function CogwheelsSeparator({ children }: { children: ReactNode }) {
  return (
    <div className={styles.cogwheelsSeparator}>{children}</div>
  );
}

export default function Loader({
  open,
  label,
  loaderTextAdditionalSlot,
}: LoaderProps) {
  return (
    <LoaderVisibility open={open} className={styles.loader}>
      <Cogwheel
        data-testid={LOADER_TEST_ID}
        childrenClassName={styles.cogwheelCenterTop}
      >
        <CogwheelsSeparator>
          {[
            {
              bgClassName: styles.emerald,
              sizeClassName: styles.size12,
            },
            {
              bgClassName: styles.red,
              sizeClassName: styles.size10,
            },
          ].map((props: CogwheelProps) => (
            <Cogwheel key={`cog-1-${props.bgClassName}`} {...props}>
              <Bolt />
            </Cogwheel>
          ))}
        </CogwheelsSeparator>
        <CogwheelsSeparator>
          {[
            {
              bgClassName: styles.pink,
              sizeClassName: styles.size16,
              bolt: <Bolt centerPointClassName={styles.boltCenterLowered} />,
            },
            {
              className: styles.raised,
              bgClassName: styles.zinc,
              sizeClassName: styles.size8,
              bolt: <Bolt />,
            },
          ].map(({ bolt, ...props }) => (
            <Cogwheel key={`cog-2-${props.bgClassName}`} {...props}>
              {bolt}
            </Cogwheel>
          ))}
        </CogwheelsSeparator>
      </Cogwheel>
      <LoaderText label={label} slot={loaderTextAdditionalSlot} />
    </LoaderVisibility>
  );
}

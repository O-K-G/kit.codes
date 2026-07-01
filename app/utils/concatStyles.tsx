/** Use to combine 'className' styles.  */

type ConcatStylesProps = string[];

export function concatStyles(arrValue: ConcatStylesProps) {
  return arrValue.join(" ");
}

import { Children, cloneElement, isValidElement } from 'react';
import {
  ChildWithNewProps,
  HandleChildrenWithNewPropsProps,
} from '@constants/interfaces';

export default function useHandleChildrenWithNewProps() {
  const handleChildrenWithNewProps = ({
    children,
    scrollableRef,
    onSubsectionSelectChange,
  }: HandleChildrenWithNewPropsProps) =>
    Children.map(children, (child, index) => {
      if (isValidElement(child)) {
        return cloneElement(child, {
          id: index,
          total: Children.count(children),
          ref: scrollableRef,
          onSubsectionSelectChange,
        } as ChildWithNewProps);
      }
    });

  return { handleChildrenWithNewProps };
}

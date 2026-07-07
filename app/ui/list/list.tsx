import Typography from "@ui/typography/typography";
import styles from "./list.module.css";
import { concatStyles } from "@utils/concatStyles";

type ListListProps = {
  data?: string[];
  className?: string;
};

export default function List({ data, className = "", ...rest }: ListListProps) {
  if (!!data?.length) {
    return (
      <ul className={concatStyles([styles.list, className])} {...rest}>
        {data.map((str) => (
          <Typography key={`list-${str}`} component="li" color="paper">
            <span>&#9702;</span>
            {str}
          </Typography>
        ))}
      </ul>
    );
  }
}

import { FC, HTMLAttributes, useEffect, useState } from "react";
import styles from "./ExpandMenu.module.scss";
import classNames from "classnames";
import { Scrollbar } from "../Scrollbar";
import { SvgChevron } from "../svg";
import { useAppDispatch, useAppSelector } from "@/src/lib/app/store";
import { setExpandPosition } from "@/src/lib/app/store/slices/commonSlice";

interface IExpandMenuProps
  extends Pick<HTMLAttributes<HTMLDivElement>, "children" | "id"> {
  position?: "left" | "right";
}

export const ExpandMenu: FC<IExpandMenuProps> = ({
  children,
  position = "left",
  ...props
}) => {
  const dispatch = useAppDispatch();
  const { expandPosition } = useAppSelector((state) => state.common);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    dispatch(setExpandPosition(isActive ? position : undefined));
  }, [isActive, dispatch, position]);

  return (
    <div
      className={classNames(styles.menu, {
        [styles.menu_active]: !isActive,
      })}
      style={{
        pointerEvents:
          !!expandPosition && expandPosition !== position ? "none" : "auto",
        right: position === "right" ? "0" : "unset",
        direction: position === "right" ? "rtl" : "ltr",
        transform: !isActive
          ? position === "right"
            ? "translateX(calc(100% - 30px))"
            : "translateX(calc(-100% + 30px)"
          : "none",
      }}
      {...props}
    >
      <Scrollbar type="absolute" stl={styles}>
        {children}
      </Scrollbar>
      <div
        className={styles.menu__expand}
        onClick={() => setIsActive(!isActive)}
      >
        <SvgChevron
          style={{
            rotate:
              (isActive && position === "left") ||
              (!isActive && position === "right")
                ? "90deg"
                : "270deg",
          }}
          className={classNames(styles.menu__chevron, {
            [styles.menu__chevron_active]: isActive,
          })}
        />
      </div>
    </div>
  );
};

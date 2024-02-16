import { FC, useEffect } from "react";
import { IConsole } from "../../interfaces/responses";
import { getConsoleIds } from "@retroachievements/api";
import { authorization } from "../../utils/authorization";
import { consolesImages } from "../../utils/consoleImages";
import ConsolesGroup from "./ConsolesGroup/ConsolesGroup";
import styles from "./ConsolesList.module.scss";
import Toggle from "@atlaskit/toggle";
import { getGenres, getModes, getPlatforms } from "../../utils/IGDB";
import { useAppDispatch, useAppSelector } from "../../store";
import RoyalList from "./RoyalList/RoyalList";
import IGDBList from "./IGDBList/IGDBLIst";
import { resetStates } from "../../utils/resetStates";
import {
  setApiType,
  setOnlyWithAchievements,
  setRoyal,
} from "../../store/selectedSlice";
import { setSystemsRA } from "../../store/commonSlice";
import {setPlatformsLoading} from "../../store/statesSlice";

const ConsolesList: FC = () => {
  const dispatch = useAppDispatch();
  const {
    apiType,
    isRoyal,
    isOnlyWithAchievements,
    selectedGeneration,
    royalGamesRA,
    royalGamesIGDB,
  } = useAppSelector((state) => state.selected);
  const { token } = useAppSelector((state) => state.auth);

  const consolesGroup = [
    "Nintendo",
    "Sony",
    "Atari",
    "Sega",
    "NEC",
    "SNK",
    "Other",
  ];

  const royalGames = apiType === "RA" ? royalGamesRA : royalGamesIGDB;

  useEffect(() => {
    if (isRoyal) return;

    const fetchConsoleIds = async () => {
      const consolesIds = await getConsoleIds(authorization);
      const consolesImagesIds = consolesImages.map((image) => image.id);

      const consolesWithAchievements: IConsole[] | undefined =
        consolesIds.filter((console) => consolesImagesIds.includes(console.id));
      dispatch(setSystemsRA(consolesWithAchievements));
    };

    apiType === "RA" && fetchConsoleIds();

    if (apiType === "IGDB" && !!token) {
      getGenres();
      getModes();
    }
  }, [apiType, isRoyal, token, dispatch]);

  useEffect(() => {
    if (apiType !== "IGDB" || isRoyal || !token) return;

    dispatch(setPlatformsLoading(true));

    getPlatforms(selectedGeneration);
  }, [selectedGeneration, dispatch, apiType, isRoyal, token]);

  return (
    <div className={styles.consoles__list}>
      <label className={styles.consoles__type}>
        RetroAchievements
        <Toggle
          isChecked={apiType === "IGDB"}
          onChange={() => {
            resetStates();
            dispatch(setApiType(apiType === "IGDB" ? "RA" : "IGDB"));
          }}
        />
        IGDB
      </label>
      <div className={styles.consoles__options}>
        <h3>Options</h3>
        {apiType === "RA" && (
          <label className={styles.consoles__option}>
            <Toggle
              isChecked={isOnlyWithAchievements}
              onChange={() =>
                dispatch(setOnlyWithAchievements(!isOnlyWithAchievements))
              }
            />
            Only with achievements
          </label>
        )}
        <label className={styles.consoles__toggle}>
          <Toggle
            isChecked={isRoyal}
            onChange={() => {
              resetStates();
              dispatch(setRoyal(!isRoyal));
            }}
          />
          <span>
            Royal {!!royalGames?.length ? `(Games: ${royalGames.length})` : ""}
          </span>
        </label>
      </div>
      {apiType === "IGDB" && !isRoyal && <IGDBList />}
      {apiType === "RA" && !isRoyal && (
        <div className={styles.consoles__groups}>
          {consolesGroup.map((item, i) => (
            <ConsolesGroup key={i} system={item} />
          ))}
        </div>
      )}
      {isRoyal && <RoyalList />}
    </div>
  );
};

export default ConsolesList;
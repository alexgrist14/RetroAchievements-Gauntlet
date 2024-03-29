import { IGDBAgent } from "../../api";
import { IIGDBGenre } from "../../interfaces";
import { store } from "../../store";
import { setGenres } from "../../store/commonSlice";

export const getGenres = () => {
  IGDBAgent<IIGDBGenre[]>("https://api.igdb.com/v4/genres", {
    limit: 500,
    fields: "name, slug, url",
  }).then((response) => store.dispatch(setGenres(response.data)));
};

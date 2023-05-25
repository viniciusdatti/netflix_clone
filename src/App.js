import React from "react";
import "./App.css";
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow";
import FeaturedMovie from "./components/FeaturedMovie";
import Header from "./components/Header";

const App = () => {
	const [movieList, setMovieList] = React.useState([]);
	const [featuredData, setFeaturedData] = React.useState([]);
	const [blackHeader, setBlackHeader] = React.useState(false);

	React.useEffect(() => {
		const loadAll = async () => {
			// Pegando a lista TOTAL
			let list = await Tmdb.getHomeList();
			setMovieList(list);

			// Pegando o Featured
			let originals = list.filter((i) => i.slug === "originals");
			let randomChosen = Math.floor(
				Math.random() * (originals[0].items.results.length - 1)
			);
			let chosen = originals[0].items.results[randomChosen];
			let chosenInfo = await Tmdb.getMovieInfo(chosen.id, "tv");
			setFeaturedData(chosenInfo);
		};
		loadAll();
	}, []);

	React.useEffect(() => {
		const scrollListener = () => {
			if (window.scrollY > 10) {
				setBlackHeader(true);
			} else {
				setBlackHeader(false);
			}
		};

		window.addEventListener("scroll", scrollListener);
		return () => {
			window.removeEventListener("scroll", scrollListener);
		};
	}, []);

	return (
		<div className="page">
			<Header black={blackHeader} />

			{featuredData && <FeaturedMovie item={featuredData} />}

			<section className="lists">
				{movieList.map((item, key) => (
					<div>
						<MovieRow key={key} title={item.title} items={item.items} />
					</div>
				))}
			</section>

			<footer>
				Feito por{" "}
				<span role="img" aria-label="coração">
          Vinicius Datti{" "}
        </span>{" "}
				<br />
				Direitos de imagem para Netflix
				<br />
				Dados utlizados do site ThemovieDB.org
			</footer>

			{movieList.length <= 0 && (
				<div className="loading">
					<img
						width="800px"
						src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif"
						alt="loading"
					/>
				</div>
			)}
		</div>
	);
};

export default App;
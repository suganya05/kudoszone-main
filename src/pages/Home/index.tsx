import React from "react";

import "./Home.scss";
import Hero from "./components/Hero";
import Collection from "./components/Collection";
import TrendingCollection from "./components/TrendingCollection";
import { useGetAllCollectionsQuery } from "store/services/exploreApi";

const Home: React.FC = () => {
  const { data, isLoading } = useGetAllCollectionsQuery({});

  return (
    <div className="home">
      <div className="mx pad">
        <Hero data={data?.latestCollection?.[0]} />
        <Collection
          title="Most Popular Collections"
          loading={isLoading}
          data={data?.topCollection}
        />
        <Collection
          title="Latest Collections"
          loading={isLoading}
          data={data?.latestCollection}
        />
        <TrendingCollection />
      </div>
    </div>
  );
};

export default Home;

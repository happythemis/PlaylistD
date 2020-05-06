import React , {Component, useEffect} from 'react';

const Home = (props) => {
  useEffect(() => {
    props.cls(0);
    props.cln("");
    props.cui(-1);
  }, []);

  return (
      <h1> Welcome to PlaylistD</h1>
  );
}

export default Home;
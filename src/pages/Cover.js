import "./Cover.css";
import {Routes, Route, useNavigate} from 'react-router-dom';
import Login from './Login';
/*const handleClick = () => {
  window.location.href='https://itsmeprasanth.github.io/Login/index.html';

};*/

import Header from "./Header";
const Cover = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    
    navigate('/login');
  };
  return (
<div className="cover">
      <section className="first">
        <div className="first-page">
       <Header />
          <img
            className="cecily-borwn-1-1-icon"
            alt=""
            src="/cecily-borwn-1-1@2x.png"
          />
         
          
        </div>
      </section>
      <section className="genre">
        <h1 className="explore-a-palette">Explore a Palette of Genres</h1>
        <h1 className="explore-a-palette1">Explore a Palette of Genres</h1>
        <div className="genre-child" />
        <div className="rectangle-parent">
          <img className="frame-child" alt="" src="/rectangle-1@2x.png" />
          <div className="frame-item" />
        </div>
        <div className="the-sun-and-container">
          <span className="tracey-emin-txt-container">
            <p className="the-sun-and">The Sun and the Moon</p>
            <p className="the-sun-and">-Camilla Engström</p>
          </span>
        </div>
        <b className="contemporary-art">Contemporary Art</b>
        <div className="for-those-who">
          For those who crave innovation and new perspectives, our contemporary
          art collection is a must-see. It showcases the works of artists who
          are pushing the boundaries of traditional art, using modern mediums
          and concepts to provoke thought and emotion.
        </div>
        <div className="rectangle-group">
          <img className="frame-inner" alt="" src="/rectangle-3@2x.png" />
          <div className="frame-div" />
        </div>
        <div className="step-into-a">
          Step into a world of precision and detail with our realism and
          impressionism collections. These works of art capture the essence of
          reality in a way that feels almost tangible. Let the exquisite
          brushstrokes and impeccable attention to detail transport you to
          different times and places.
        </div>
        <b className="realism-and-impressionism">Realism and Impressionism</b>
        <div className="houses-of-parliament-container">
          <span className="tracey-emin-txt-container">
            <p className="the-sun-and">Houses of Parliament</p>
            <p className="the-sun-and">-Claude Monet</p>
          </span>
        </div>
        <div className="watchdog-ii-nam-june-paik-wrapper">
          <div className="watchdog-ii-nam-container">
            <span className="tracey-emin-txt-container">
              <p className="the-sun-and">Watchdog II</p>
              <p className="the-sun-and">-Nam June Paik</p>
            </span>
          </div>
        </div>
        <div className="our-gallery-isnt">
          Our gallery isn't limited to two-dimensional art. Explore the world of
          three-dimensional art with our sculpture and installation collection.
          These captivating pieces provide a tactile experience, inviting you to
          interact with art in a whole new way.
        </div>
        <div className="genre-item" />
        <b className="scupltures">Scupltures</b>
        <img className="genre-inner" alt="" src="/rectangle-2@2x.png" />
        <div className="ellipse-div" />
      </section>
      <section className="about-us">
        <img className="about-us-child" alt="" src="/group-6.svg" />
        <img className="about-us-item" alt="" src="/rectangle-4@2x.png" />
        <div className="at-gallery-name-container">
          <span className="tracey-emin-txt-container">
            <p className="the-sun-and">
              At Dream Artscapes, we're dedicated to connecting artists with a
              global audience. Our mission is to celebrate diverse art forms,
              provide exposure to talented creators, and foster an inclusive
              artistic community. Explore a rich collection of art that spans
              various genres, styles, and perspectives. Join us on a journey of
              creativity and inspiration.
            </p>
            <p className="blank-line">&nbsp;</p>
          </span>
        </div>
        <h1 className="about-us1">About Us</h1>
        <div className="about-us-inner" />
      </section>
      <section className="featured">
        <b className="featured-artists">Featured Artists</b>
        <img className="featured-child" alt="" src="/rectangle-5@2x.png" />
        <img className="featured-item" alt="" src="/rectangle-9@2x.png" />
        <img className="featured-inner" alt="" src="/rectangle-10@2x.png" />
        <img className="rectangle-icon" alt="" src="/rectangle-11@2x.png" />
        <img className="featured-child1" alt="" src="/rectangle-12@2x.png" />
        <div className="yoko-ono-wrapper">
          <h2 className="yoko-ono">Yoko Ono</h2>
        </div>
        <div className="tracey-emin-wrapper">
          <h2 className="tracey-emin">
            <span className="tracey-emin-txt-container">
              <span>Tracey Emin</span>
              <b className="b">{`      `}</b>
            </span>
          </h2>
        </div>
        <div className="sylvie-bayard-wrapper">
          <h2 className="sylvie-bayard">{`Sylvie  Bayard    `}</h2>
        </div>
        <div className="mattia-riccadona-wrapper">
          <h2 className="sylvie-bayard">Mattia Riccadona</h2>
        </div>
        <div className="kara-walker-wrapper">
          <h2 className="kara-walker">Kara Walker</h2>
        </div>
      </section>
     
    </div>
  );
};

export default Cover;

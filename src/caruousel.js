import React, { useState } from 'react';

var totalSlides = 2;
var currentSlide = 0;

function Slide1() {
  return <img id="userimg" src={require('./images/applogo.png')} alt="user Profile" width="760px" height="350px" />;
}
function Slide2() {
  return <img id="userimg" src={require('./images/emptyCart.png')} alt="user Profile" width="760px" height="350px" />;
}
function Slide3() {
  return <img id="userimg" src={require('./images/user.png')} alt="user Profile" width="760px" height="350px" />;
}



function increment(right){
  if(right === true){
    currentSlide++;
    if(currentSlide > totalSlides){
      currentSlide = 0;
    }
  }
  else{
    currentSlide--;
    if(currentSlide < 0){
      currentSlide = 2;
    }
  }

  return currentSlide;
}

function Carousel()
{
  
  const [activeView, setActiveView] = useState(currentSlide);
 
  React.useEffect(() => {  
    var time = 5000;
    const id = setTimeout(() => changeView(increment(true)), time);
    return () => clearTimeout(id);
  }, [activeView]);

  const changeView = (view) => {
    console.log(view);
    setActiveView(view);
  };
  return (

      <div>
          {activeView === 0 && <Slide1 />}
          {activeView === 1 && <Slide2 />}
          {activeView === 2 && <Slide3 />}
          <button onClick={() =>  changeView(increment(true))}>Next</button>
          <button onClick={() =>  changeView(increment(false))}>Previous</button>
      </div>


  );
}

export default Carousel;
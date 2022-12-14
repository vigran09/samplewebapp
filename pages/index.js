import {useEffect, useRef, Fragment} from 'react';
import {Loader} from '@googlemaps/js-api-loader';
import React from "react";
import locations from '../locations.json';
import Carousel from './CarouselSlider';
 
const Maps = () => {

  const googlemap = useRef(null);
  const apiOptions = {
    apiKey: 'AIzaSyAqJUf7ZdKXNZO8KG8mC6VHDv-tiHy_QhI',
    version: "beta"
  };
  const mapOptions = {
    "zoom": 18,
    "heading": 320,
    "tilt": 47.5,
  }
  const handleLocationUpdate = (locationIndex) =>
  {
    const location = { lat: locations.places[locationIndex].latitude, lng: locations.places[locationIndex].longitude };
    map?.panTo(location);
  } 
  let map;
  let isAnimating = false;


  useEffect(() => {
    const loader = new Loader(apiOptions);
    loader.load().then(() => {
      LoadMap();
      AddMarkers(map);
    });

    function LoadMap(){
      const google = window.google;
      map = new google.maps.Map(googlemap.current,  {
        center: { lat: 50.14474,  lng: 11.05938 },
        zoom: 17,
        mapId:"d78e050a3a97c54b",
        mapTypeControl: false,
        streetViewControl: false, 
      }
      ); 
    }

    function LocateStation(marker, event){
      map.setCenter(event.latLng.lat(),event.latLng.lng());
      marker.setAnimation(google.maps.Animation.BOUNCE);
      const { tilt, heading, zoom } = mapOptions;
      map.moveCamera({tilt, heading, zoom });
      requestAnimationFrame(animateCamera);
    }

    function animateCamera(time) {
      if(isAnimating){
        map.moveCamera({
          heading: (time / 1000) * 5
        });
        requestAnimationFrame(animateCamera);
      }
    }

    function AddMarkers(){
      for (let i = 0; i < locations.places.length; i++) {
        const userPlace = locations.places[i];
        const marker = new google.maps.Marker({
          map: map,
          position: {
            lat: userPlace.latitude,
            lng: userPlace.longitude,
          },
          title: userPlace.name,
        });
        var contentBtn = '<p><button id="Test" class="ui-button">Click Me for directions!</button></p>';
        const contentString =
        '<div>' +
        '<h1>Sample Web App</h1>'+
        "<p><b>New contents to be added from JSON or CMS.....</b></p>" +
        "</div>";
        var infowindow = new google.maps.InfoWindow({
          content: contentString + contentBtn,
        });

        /* Code for mouse hover
        google.maps.event.addListener(marker, 'mouseover', function(){
          console.log("Hovered");
         });
        End */
        marker.addListener("click", event => {
          isAnimating = true;
          const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
          map.panTo(location); 
          infowindow.open({
            anchor: marker,
            map,
          });
          infowindow.addListener('closeclick', ()=>{
            isAnimating = false;
            LoadMap();
            AddMarkers(map);
          });
          LocateStation(marker, event);  
       });
      }
      const icon = {
        url: 'https://i.imgur.com/9v6uW8U.png', 
        scaledSize: new google.maps.Size(40,40), 
        origin: new google.maps.Point(0,0), 
        anchor: new google.maps.Point(0, 0) 
    };
    }
  });
  return (
    <Fragment>
    <div id="map" ref={googlemap} />
    <Carousel updateLocation = {handleLocationUpdate}/>
    </Fragment>
  );
};
export default Maps;
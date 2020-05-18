   <template> 
   <div class="top_level">
        <!--this is the Iterated content-->
      <div class="outer_frame">
        <div class="img_frame">
          <img src="./album.jpg" alt="redbox" />
          <!--to be the album art -->
          <img src="./grunge.jpg" alt="grunge" />
        </div>
        <div class="info_frame">
          <h1>Testy Testerson</h1>
          <h2>Testy and the Testations vol. 1</h2>
          <h3>You can't test me.</h3>
        </div>
      </div>
    </div>
    </template>
    
    <style>
    * {
  margin: 0;
  padding: 0;
  display: inline-block;
  box-sizing: border-box;
  useless-code: none;
}

/* hacky media query 
just used to resize images, used wildcard element selector, should be removed
unless the history is it's own component and effects no other text.
*/
@media only screen and (max-width:530px) {
    img {
        width: 90%;
    }
    * {
        font-size: 1rem;
        letter-spacing: 0;
    }
}

.top_level {
  background-color: green;
  width: 100%;
  height: 10000px; /* temp */
}
.outer_frame {
  border-radius: 6px;
  width: 90%;
  height: 150px;
  margin: 5px auto;
  background-color: beige;
  display: grid;
  grid-template-columns: 1fr 2fr;
  background: linear-gradient(rgb(0, 13, 128) 40%, rgb(7, 6, 78) 90%),
    linear-gradient(to right, rgb(22, 14, 54) 40%, rgb(168, 160, 241) 90%),
    url("album.jpg") 50px, url("album.jpg") 0px;
  background-blend-mode: screen, screen, soft-light;
  /* mess around with these to get good effect*/
}
.img_frame {
  /* fix left side of div to not overlap border-radius of outer_frame */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
}
.img_frame > img {
  border-radius: 30%;
  max-height: 95%;
  background-size: contain;
}
.img_frame > img:first-child {
  position: absolute;
  mix-blend-mode: multiply;
}
.info_frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  justify-content: space-around;
  padding-left: 10px;
  text-shadow: 2px 1px 2px #5a7a63;
  letter-spacing: 0.3rem;
    </style>

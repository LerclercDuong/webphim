
const express = require('express');
const handlebars = require('express-handlebars')
const path = require('path')
const app = express()
const axios = require('axios')
const port = process.env.PORT || 5000
const { MovieDb } = require('moviedb-promise')
const moviedb = new MovieDb('2c6f79941461abf6df2d3d5cabfc9f81')
var cookie = require('cookie');
let COOKIE_OPTIONS = { httpOnly: true, sameSite: 'None', secure: true };
const session = require('express-session');
const favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
app.use(cookieParser())

app.set('trust proxy', true);

const sessionConfig = {
  secret: 'MYSECRET',
  name: 'appName',
  resave: false,
  saveUninitialized: false,
  cookie : {
    sameSite: 'none', 
    secure: true
  }
};
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.get('/favicon.ico', (req, res) => res.status(204));

app.use(session(sessionConfig));
// app.use(favicon(__dirname + 'src/public/favicon.ico'));

// app.use(express.static(path.join(__dirname, 'src/public')))
// app.use('/logo1.png', express.static('src/public/logo1.png'));

app.set('views',path.join(__dirname, 'src/resources/views'))
console.log(path.join(__dirname, 'src/resources/views'))
app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())
app.engine('handlebars', handlebars())
app.set('view engine','handlebars')


app.use((req, res, next) => {
  const host = req.header('host');
  if (host.match(/^www\..*/i)) {
      next();
  } else {
      res.redirect(301, `${req.protocol}://www.${host}${req.url}`);
  }
});

// // mới
app.get('/', function (req, res){
  const title = "Chillphimnew.xyz | Xem Phim mới | PHIM HD | Watch full HD movies | Phim chiếu rạp | Theatre movies "
  // getPOPULARFILM
  // const getVN = axios({
  //   method: 'get',
  //   url: `https://api.themoviedb.org/3/movie/${req.query.id}/translations?api_key=2c6f79941461abf6df2d3d5cabfc9f81`
  // })
  const getgenres = axios({
    method: 'get',
    url: 'https://api.themoviedb.org/3/genre/movie/list?api_key=2c6f79941461abf6df2d3d5cabfc9f81&language=en-US'
  }).then(function (response){
    return response.data.genres;
  })
const getpopularfilm = axios({
    method: 'get',
    url: 'https://api.themoviedb.org/3/movie/popular?api_key=2c6f79941461abf6df2d3d5cabfc9f81&language=en-US&page=1'
  })
 .then(function(response){
   var rdm = Math.round(Math.random() *13);
   const main = response.data.results[rdm];
   const popular = []
   for(i=rdm;i<rdm+6; i++){
     popular.push(response.data.results[i])
   }
   return popular    
  })
    //  GET ACTION FILM
  
  const getactionfilm = axios({
    method: 'get',
    url:'https://api.themoviedb.org/3/discover/movie?api_key=2c6f79941461abf6df2d3d5cabfc9f81&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=28&without_genres=878&with_watch_monetization_types=flatrate'
  })
  .then(function(response){
    var rdm = Math.round(Math.random() *10);
    const action = []
    for(i=rdm;i<rdm+6; i++){
      action.push(response.data.results[i])
    }
    return action  
  })
  // GET TOPRATED
  const gettopratedfilm = axios({
    method: 'get',
    url:'https://api.themoviedb.org/3/movie/top_rated?api_key=2c6f79941461abf6df2d3d5cabfc9f81&language=en-US&page=1'
  })
  .then(function(response){
    var rdm = Math.round(Math.random() *12);
    const toprate = []
    for(i=rdm;i<rdm+6; i++){
      toprate.push(response.data.results[i])
    }
    return toprate
  })
  // GET UPCOMING

  const getupcomingfilm = axios({
    method: 'get',
    url:'https://api.themoviedb.org/3/movie/upcoming?api_key=2c6f79941461abf6df2d3d5cabfc9f81&language=en-US&page=1'
  })
  .then(function(response){
    var rdm = Math.round(Math.random() *14);
    const upcoming = []
    for(i=rdm;i<rdm+6; i++){
      upcoming.push(response.data.results[i])
    }
    return upcoming
  })

 const renderFilm= async function(){

     const popular = await getpopularfilm;
      const action = await getactionfilm;
      const toprated = await gettopratedfilm;
      const upcoming = await getupcomingfilm;
      const genres = await getgenres;
      const main = popular[1]
      const id = main.id;
      const mm = []
    for(i=1;i<6; i++){
      mm.push(popular[i])
    }
   
      axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${id}/translations?api_key=2c6f79941461abf6df2d3d5cabfc9f81`
      }).then(function (response) {
        const vi = response.data.translations
        const final = vi.filter(function(e){
          return e.iso_3166_1==='VN'
        })
        var getVietnamese = {}
    if(final[0] === undefined){
     getVietnamese = main
    }else {
       getVietnamese =  final[0].data
    }
       
       res.render('home', {main:mm, popular:popular, action:action, toprated:toprated, upcoming:upcoming, vietsub:getVietnamese, genres:genres, title:title})
      })
   
      
 }
 renderFilm()
  
 })


 app.get('/', function (req, res){
  axios({
    method: 'get',
    url: 'https://api.themoviedb.org/3/list/28?api_key=2c6f79941461abf6df2d3d5cabfc9f81&language=en-US'
  })
 .then(function(response){
   var rdm = Math.round(Math.random() *13);
   const action = []
   for(i=rdm;i<rdm+6; i++){
     action.push(response.data.results[i])
   }
  
   res.render('home', { phimhanhdong:action})
 
      
  })
   
 })

app.get('/watch', (req,res) => {
  
 const getVN = axios({
    method: 'get',
    url: `https://api.themoviedb.org/3/movie/${req.query.id}/translations?api_key=2c6f79941461abf6df2d3d5cabfc9f81`
  })
  .then(response =>{
    const vni = response.data.translations
    const final = vni.filter(function(e){
      return e.iso_3166_1==='VN'
    })
    return final
   
  })
const getDetail = axios({
  method: 'get',
  url: `https://api.themoviedb.org/3/movie/${req.query.id}?api_key=2c6f79941461abf6df2d3d5cabfc9f81&language=en-US`
})
.then((response) => {
  return response.data
})
 const getsimilar = axios({
    method: 'get',
    url: `https://api.themoviedb.org/3/movie/${req.query.id}/similar?api_key=2c6f79941461abf6df2d3d5cabfc9f81&language=en-US&page=1`
  })
  .then(function (response){ 
      return response.data.results
  })



  const renderFilm = async function(){
    const final = await getVN;
    const details = await getDetail;
    const similar = await getsimilar;
    const id = req.query.id
    const title = "Xem phim" + ' '+ details.title + ' '+ "trên Chillphimnew.xyz | phim hd | Phim chiếu rạp hay"
    var getVietnamese = {}
    if(final[0] === undefined){
     getVietnamese = details
    }else {
       getVietnamese =  final[0].data
    }
  const url = `https://www.2embed.ru/embed/tmdb/movie?id=${id}`
  res.cookie('Set-Cookie',{domain:'https://www.2embed.ru' ,SameSite: 'none', Secure: true})
    res.render('watch',{similar:similar, url:url, details:details, vietnamese: getVietnamese, title:title})
    
}
renderFilm()

})
  
  app.get('/phobien',(req,res)=>{
  const page = req.query.page;
    
     axios({
      method: 'get',
      url: `https://api.themoviedb.org/3/movie/popular?api_key=2c6f79941461abf6df2d3d5cabfc9f81&language=en-US&page=${page}`
    })
    .then(function (response){ 
       const phobien = []
      for(i=0; i<response.data.results.length; i++){
      
          phobien.push(response.data.results[i])
      }
    res.render('phimchieurap',{popular:phobien, page:page})
      
    })
    
  
  
 
    })



    app.get('/toprated',(req,res)=>{
      const page = req.query.page;
        
         axios({
          method: 'get',
          url: `https://api.themoviedb.org/3/movie/top_rated?api_key=2c6f79941461abf6df2d3d5cabfc9f81&language=en-US&page=${page}`
        })
        .then(function (response){ 
           const toprate = []
          for(i=0; i<response.data.results.length; i++){
          
              toprate.push(response.data.results[i])
          }
        res.render('toprate',{toprate:toprate, page:page})
          
        })
        
      
      
     
        })

        app.get('/bestaction',(req,res)=>{
          const page = req.query.page;
            
             axios({
              method: 'get',
              url: `https://api.themoviedb.org/3/discover/movie?api_key=2c6f79941461abf6df2d3d5cabfc9f81&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=28&without_genres=878&with_watch_monetization_types=flatrate`
            })
            .then(function (response){ 
               const bestaction = []
              for(i=0; i<response.data.results.length; i++){
              
                  bestaction.push(response.data.results[i])
              }
            res.render('bestaction',{bestaction:bestaction, page:page})
              
            })
            
          
          
         
            })

            app.get('/upcoming',(req,res)=>{
              const page = req.query.page;
                
                 axios({
                  method: 'get',
                  url: `https://api.themoviedb.org/3/movie/upcoming?api_key=2c6f79941461abf6df2d3d5cabfc9f81&language=en-US&page=${page}`
                })
                .then(function (response){ 
                   const upcoming = []
                  for(i=0; i<response.data.results.length; i++){
                  
                      upcoming.push(response.data.results[i])
                  }
                res.render('upcoming',{upcoming:upcoming, page:page})
                  
                })
                
              
              
             
                })
  
app.get('/search',(req,res) => {
  const title = req.query.result
  const getsearch =  
  moviedb.searchMovie({ query: req.query.result })
       .then((res) => {
         return res 
      })
                
                     const renderFilm = async function(){
                  const searchResult = await getsearch;
                
                  res.render('search',{searchResult:searchResult.results, title:title})
             }
             renderFilm()
})
app.get('/genres',(req,res)=>{
  
  const genre = req.query.kind
  const genreid = req.query.id
  const page = req.query.page
  const title = `Watch ${genre} movies on CHILLPHIMNEW.XYZ | Phim mới | Phim chiếu rạp hay`

  axios({
    method: 'get',
    url: `https://api.themoviedb.org/3/discover/movie?api_key=2c6f79941461abf6df2d3d5cabfc9f81&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreid}&with_watch_monetization_types=flatrate`
  })
  .then(function(response) {
       const movie = response.data.results
       res.render('genre',{genre , movie,genreid,page, title})
  })
  
    
})
                
app.listen(port)
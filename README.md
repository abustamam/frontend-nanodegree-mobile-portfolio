Mobile Portfolio
================

The goal of this project is to optimize a website in two ways.

The first goal is to optimize the website such that it gets a score of 90+ on [Page Speed Insights](https://developers.google.com/speed/pagespeed/insights/?url=abustamam.github.io%2Fmobile-portfolio). This is done by analyzing the CRP (critical rendering path) and performing optimizations such as inlining critical CSS and async-ing non-critical scripts. 

The second goal is to optimize the [pizza](http://abustamam.github.io/mobile-portfolio/pizza.html) page such that it runs at 60 FPS. This is done by performing several JavaScript optimizations (detailed below). 

## Deploying this project

Clone the repository (fork first if necessary).
```
  git clone git@github.com:abustamam/mobile-portfolio.git
  cd mobile-portfolio
```

Run `npm install` to install required assets. 

Run `gulp deploy` then `gulp build` and the project will be live. (note: for some reason `gulp deploy`'s `gulp build` task does not properly push every new file, which is why the second `gulp build` is required).

Alternatively, you can use ngrok, but site will not be completely optimized because ngrok does not compress files. 

## Optimization

To optimize the pizza page, I made several changes.

First, the move-on-scroll pizzas. I used requestAnimationFrame on scroll, rather than explicitly calling `updatePositions`. 

In addition, I moved some variable definitions outside of loops (and functions called in loops). Most notably was the `items` variable, which I defined outside of `updatePositions`, since it is constant. 

All of these changes can be seen from lines 494 to the end. 

Second, the change-size slider. Again, I moved some variable declarations outside of loops:

```
    var randomPizzas = document.getElementsByClassName('randomPizzaContainer')
    var dx = determineDx(randomPizzas[0], size);
    var newwidth = (randomPizzas[0].offsetWidth + dx) + 'px';
```

This way, the new width is calculated first, then each pizza container is updated accordingly.

This change can be viewed from lines 444 to 454.

## Explanation of gulp tasks

deploy -- deploys to gh-pages branch
htmlhint -- 'lints' html
csslint -- 'lints' CSS
jshint -- 'lints' JS
htmlmin -- minifies HTML (strip whitespace, remove comments, etc)
cssmin -- minifies CSS
uglify -- uglifies JS
psi -- calculates mobile and desktop PSI
imagemin -- minifies images
rename -- module used to add .min suffix
notify -- module used for command line notifications
cache -- stores image data in cache to speed up additional image minification
del -- deletes build folder to start fresh
critical -- module used to inline critical CSS into index.html (I did this manually for other pages as I did not want to spend time learning how to do this with multiple pages)
jpegoptim -- jpeg optimizer
pngcrush -- png optimizer

I wrote my own gulp tasks as well, which are described in the gulpfile.

## Acknowledgements

Due to the nature of optimization, files needed to be minified. Editing a page then having to minify it each time I edited it really sucked, so I opted to learn how to automate mundane tasks. 

This is why I used Gulp.js. [This tutorial helped out](http://markgoodyear.com/2014/01/getting-started-with-gulp/). So did [Michael Wales](http://michaelwales.com/articles/getting-started-with-gulpjs/)! 

Of course, the docs and plugins at [GulpJS](http://www.gulpjs.com) also helped.

For inlining critical CSS, I used [this](http://jonassebastianohlsson.com/criticalpathcssgenerator/).

For info on requestAnimationFrame, I used [this](http://www.html5rocks.com/en/tutorials/speed/animations/). 
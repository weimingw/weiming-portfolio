# Weiming Wu's Portfolio

This repo contains the exact code that runs on [my personal website, accessible here](https://weimingw.herokuapp.com/).

I redacted two files that contain API keys for obvious reasons.

# Info

The repo is split as follows:

## Weiming-Frontend

A Node.js app built on Vue that serves the website's static assets and acts as a controller to handle requests to third-party APIs or my personal backend.

The best full example of my abilities (especially mastery of design patterns) is the Hexagrid [[code]](https://github.com/weimingw/weiming-portfolio/tree/master/weiming-frontend/src/client/pages/projects/hexagrid) [[live example]](https://weimingw.herokuapp.com/projects/hexagrid) or some of my more complicated components, like my Sliders [[code]](https://github.com/weimingw/weiming-portfolio/tree/master/weiming-frontend/src/client/components/sliders).

## Weiming-Backend

A Python (Flask) app that manages my databases (MySQL and MongoDB, working together).

The best example for this subrepo is request_service.py [[code]](https://github.com/weimingw/weiming-portfolio/blob/master/weiming-backend/services/request_service.py) and its associated file handler_chain.py [[code]](https://github.com/weimingw/weiming-portfolio/blob/master/weiming-backend/utils/handler_chain.py).
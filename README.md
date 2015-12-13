# Aige (by Eckhard Kirschning)
#  Aige is development project for the establishment of a Single Page Applicaton (SPA) using Java Script (JS) end-to-end. The focus lies # on the combination of pure JS frontend and backend technologies by pushing UI rendering and business logic to the browser and 
# communicating with the server and the database only to synchronize data by exchanging data in JSON (JavaScript Serialized Object
# Notation) format.

# Frontend development is based on pure JS without using any SPA or templating frameworks (like Angular.js or Jade. However, JQuery and 
# some of its many different libraries are being used for e.g DOM manipulation, form validation or the integration of complex Ui
# components, like datepicker, timepicker, menues or pikclist.

# Backend development on the other side is based on the Node.js JS platform for the establishment of a HTTP Server, the middleware  
# Express.js as a server-side web framework to listen to incoming requests and returning relevant responses, directing URLs to distinct
# pieces of code (advanced routing),  serving static files  and http session management.

# To complete the full JS end-to-end stack MongoDB as a document storing database is introduced which uses Binary JSON  (BSON) for data 
# storage. Additionally, Mongoskin is used as a small and basic MongoDB driver.

# The general software archtitecture was mostly influenced by Michael. S. Mikowski, the author of 'Single Page Web Applications' (Manning
# Publications Co). Most prominent features are: Model-View-Controller design pattern, the module pattern for the establishment of
# defined namespaces and  application programming interfaces (API) by utilizing immediately invoked function expressions (IIFE) .

# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Screenshot of the urls page"](https://raw.githubusercontent.com/vickyruud/tinyapp/master/docs/urls-register.png)
!["Screenshot of the urls page"](https://github.com/vickyruud/tinyapp/blob/master/docs/create.png?raw=true)
!["Screenshot of the edit page"](https://github.com/vickyruud/tinyapp/blob/master/docs/urls-editpage.png?raw=true)
!["Screenshot of the urls page"](https://github.com/vickyruud/tinyapp/blob/master/docs/urls-page.png?raw=true)


## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Go to localhost:8080 on your browser and start shortening your URLs.
- To access it on a device that is not the same as the server please use the IP address of the 
  host machine instead of localhost.
  

## Using TinyApp

### Register/Login
You must login to create, view, edit or delete links.
If you have not created an account yet, please click on Register to create a new account. On the registration page, enter your email address and create a password. You will then be automatically logged into the website.

### Create new links
Click on the Create New URL link on the top of the page. You will then have to enter the complete url that you would like to shorten. This will create a short URL and store it under the My URLs page.

### Editing or Deleting URLs
You can edit or delete existing links from the My URLs page. Simply click on the delete button next to the the desired URL and it will be deleted.

Clicking on the edit button will take you to the edit page where you can enter a new long URL to relpace the existing one. The same short URL link will now redirect you to the new long URL.

### Using the Short URL

The path to use any short link is localhost:8080/u/:shortURL. This will take you directly to the long URL associated with the particular short URL.

### Logout
Once you are done, click on the Logout button to logout.
# Veridane Studio Website

A complete black-and-white static services website for advertising beginner-friendly web design services.

## Files included

- `index.html` - main website
- `thanks.html` - backup thank-you page
- `style.css` - full responsive design
- `script.js` - interactive cursor, menu, quote estimator, filters, FAQ, and form handling
- `assets/logo.svg` - Veridane Studio logo
- `assets/favicon.svg` - browser tab icon

## Quote form setup

The quote form is connected to:

`viljoenq352@gmail.com`

It uses FormSubmit:

`https://formsubmit.co/ajax/viljoenq352@gmail.com`

When a visitor submits the quote form, the page shows:

> Thank you — your quote request has been sent. I will get back to you soon.

Important: the first time you test the form, FormSubmit may send a confirmation email to `viljoenq352@gmail.com`. Open that email and confirm it. After that, future form submissions should go through normally.

## Upload to GitHub Pages

1. Extract the ZIP.
2. Upload the files inside this folder to your GitHub repository.
3. Make sure `index.html` is in the root of the repo.
4. Go to Settings → Pages.
5. Choose `Deploy from branch`, `main`, `/root`.
6. Wait for GitHub to publish the site.

## Editing packages/prices

Open `index.html` and search for the `Packages` section. Change the prices directly in the package cards.

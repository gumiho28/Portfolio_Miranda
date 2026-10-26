# Shawn Miranda portfolio

Static HTML, CSS and JavaScript portfolio. No build step or framework required.

## Pages

- `index.html`: portfolio home
- `projects/refuseme/index.html`: interactive RefuseMe concept, with simulated data and rewards

The RefuseMe source supplied by Shawn is retained with a portfolio return link, a visible simulation notice, mobile sizing, and keyboard support for clickable controls. Refreshing the demo resets its progress. It does not provide real accounts, AI coaching, partner offers or payments.

## Publishing

This repository is connected to the existing Vercel project. Updates to main trigger deployment. Production URL: https://portfolio-liart-mu-47.vercel.app

All local asset and demo links are relative, so the site also works on other static hosting.

## Verification

Checked at 1440, 768, 390 and 320 px: no horizontal overflow, all images load, headings fit within two lines. Tested RefuseMe onboarding, category selection, refusal logging, reward filtering and simulated redemption in Edge. No runtime errors observed. Design source lint passed. The design skill browser inspector timed out, so Playwright measurements and screenshots were used instead.

## Design references

Supplied screenshots and [Wix abstract illustrator template](https://www.wix.com/website-template/view/html/wh-1367) informed typography and composition. Research also considered [Brittany Chiang](https://britchiang.com/) for project detail and [Bruno Simon](https://bruno-simon.com/html/) for demonstrable work and direct contact. No conversion-rate claims are made. All project previews are from Shawn’s files.


## FurFinder demo

`projects/furfinder/index.html` is a browser-only adaptation of the defended capstone, linked from Featured Projects. Fictional data resets on refresh. No real accounts, applications or payments are connected.

Verified search and filters, sample applications and approval analytics, lost reports, simulated donations, reset, and pet add/edit/remove in the browser. Reviewed phone (390 px), tablet (768 px), and desktop layouts.

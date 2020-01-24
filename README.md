# parcel-plugin-meta-images

Sets absolute URLs for `og:image` and `twitter:image` meta tags.
This is required by the spec and relative URLs will not work on some sites such as Facebook and Twitter.

This plugin uses the value of the `og:url` meta tag to convert the image paths to an absolute URL.

## Install

```shell
npm install --save-dev git+https://github.com/plumdumpling/parcel-plugin-meta-images.git
```

## Usage

Just install this package as a development dependency. Parcel will automatically call it when building your application.

Make sure you have `og:url`, `og:image` and `twitter:image` meta tags in your html files:

```pug
<meta property="og:url" content="https://example.com">
<meta property="og:image" content="../assets/preview-image.png">
<meta name="twitter:image" content="../assets/twitter-preview-image.png">
```

Parcel will generate that into something like this:

```html
<meta property="og:url" content="https://example.com">
<meta property="og:image" content="/preview-image.1a2b3c4d.png">
<meta name="twitter:image" content="/twitter-preview-image.1a2b3c4d.png">
```

`parcel-plugin-meta-image` will then update the image paths to an absolute URL:

```html
<meta property="og:url" content="https://example.com">
<meta property="og:image" content="https://example.com/preview-image.1a2b3c4d.png">
<meta name="twitter:image" content="https://example.com/twitter-preview-image.1a2b3c4d.png">
```

## License

[MIT](https://github.com/plumdumpling/parcel-plugin-meta-images/blob/master/LICENSE)

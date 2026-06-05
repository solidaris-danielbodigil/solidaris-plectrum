- ### 2-tools

  - #### mixins:

    `tools.borders.scss`

    #### Create a map of each prop in $\_border-props

    Example:

    ```css
    @function get-border-width($_width) {
      $border-widths: map-get($_border-props, border-width);
      @return map-get($border-widths, $_width);
    }
    ```

        #### Create a mixin for borders

    Values are set by default. You can only place values from `settings.borders.scss`

    Example:

    ```css
    @mixin border($\_status: default, $\_width: default, $\_radius: small, $\_shadow: none, $\_style: solid, $\_direction: all, $\_radius-direction: all) {
      ...;
    }
    ```

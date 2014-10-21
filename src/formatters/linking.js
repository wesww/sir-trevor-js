(function() {
  /*
    Link Formatter
    --
    Launches the link creation modal
  */


  var LinkFormatter = SirTrevor.Formatter.extend({

    title: "link",
    iconName: "link",
    cmd: "CreateLink",
    text : "link",


    initialize: function() {
      this.modal = new LinkModal();
      $(document.body).append(this.modal.$el);
    },

    onClick: function() {
      var linkNode,
          anchorNode;

      if (this.isActive()) {
        linkNode = this.linkNode();
      } else { // if a link doesn't already exist here, make one
        document.execCommand(this.cmd, false, "http://");
        anchorNode = window.getSelection().anchorNode;

        // After you add a link, reasonable browsers will set the anchorNode to
        // the text node inside the created link. Firefox doesn't always update
        // the selection object, so the anchorNode is still the text node we had
        // before we made a link. If we look for the nextSibling of this, we get
        // our new anchor
        if (anchorNode.nextSibling) {
          linkNode = anchorNode.nextSibling;
        } else {
          linkNode = anchorNode.parentNode;
        }
      }

      if (linkNode) {
        this.modal.load(linkNode);
        this.modal.render();
        this.modal.show();
      } else {
        console.log("ST: Failed to find link after it was created");
      }
    },

    linkNode: function() {
      var selection = window.getSelection(),
          anchorNode = selection.anchorNode,
          node;

      if (anchorNode.nodeName == "#text") { // Most selections return a text node inside a tag
        node = anchorNode.parentNode;
      } else {                              // Firefox if you dblclicked the word
        node = anchorNode.childNodes[selection.anchorOffset];
      }

      return node.nodeName == "A" ? node : null;
    },

    isActive: function() {
      return !!this.linkNode();
    }
  });


  /*
    Link Modal
    --
    Used to create and edit links in text content
  */

  var LinkModal = (function() {

    var LinkModal = function(options) {
      this.options = _.extend({}, SirTrevor.DEFAULTS.linkModal, options || {});
      this._ensureElement();
      this._bindFunctions();

      this.initialize.apply(this, arguments);
    };

    _.extend(LinkModal.prototype, FunctionBind, SirTrevor.Events, Renderable, {

      className: 'st-link-modal__wrapper',

      bound: ["onFormSubmit", "onElClicked"],

      initialize: function() {
        // this.$el.bind('click', '.st-link-modal-done', this.onDoneButtonClick);
        this.$el.bind('click', this.onElClicked);
      },

      hide: function() {
        this.$el.removeClass('st-link-modal--is-ready');
      },

      show: function() {
        this.$el.addClass('st-link-modal--is-ready');
      },

      remove: function() { this.$el.remove(); },


      load: function(linkNode) {
        this.linkNode = linkNode;
      },

      template: _.template([
        "<div class='st-link-modal'>",
          "<h2 class='st-link-modal__title'>Make a link</h2>",
          "<form>",
            "<table width='100%'>",
              "<tr>",
                "<td colspan='2'>",
                  "<label>URL</label>",
                "</td>",
              "</tr>",
              "<tr>",
                "<td colspan='2'>",
                  "<input class='st-link-modal__link-href' value='<%= link %>' />",
                "</td>",
              "</tr>",
              "<tr>",
                "<td>",
                  "<label>Open in new window?</label>",
                "</td>",
                "<td>",
                  "<input type='checkbox' class='st-link-modal__new-window-option'",
                    "<% if (openInNewWindow) { %> checked='checked'<% } %> />",
                "</td>",
              "</tr>",
              "<tr>",
                "<td>",
                  "<label>Block from search engines</label>",
                "</td>",
                "<td>",
                  "<input type='checkbox' class='st-link-modal__block-search-engines-option'",
                      "<% if (blockSearchEngines) { %> checked='checked'<% } %> />",
                "</td>",
              "</tr>",
              "<tr>",
                "<td>",
                  "<button type='submit' class='st-link-modal__button'>Submit</button>",
                "</td>",
              "</tr>",
            "</table>",
          "</form>",
        "</div>"
      ].join('')),

      render: function() {
        var html = this.template({
            openInNewWindow: this.linkNode.getAttribute('target') == '_blank',
            blockSearchEngines: this.linkNode.getAttribute('rel') == 'nofollow',
            text: this.linkNode.innerHTML,
            link: this.linkNode.getAttribute('href')
          });

        this.$el.html(html);
        this.$form = this.$el.find('form');
        this.$form.on('submit', this.onFormSubmit);

        return this;
      },

      onFormSubmit: function(e) {
        e.preventDefault();

        var f = this.$form.find.bind(this.$form);
        var formData = {
          openInNewWindow: f('.st-link-modal__new-window-option').prop('checked'),
          blockSearchEngines: f('.st-link-modal__block-search-engines-option').prop('checked'),
          link: f('.st-link-modal__link-href').val()
        }

        if (formData.link == "http://" || formData.link == "") {
          alert("Please use a valid URL");
          return;
        }

        this.linkNode.href = formData.link;
        this.linkNode.rel = formData.blockSearchEngines ? 'nofollow' : '';
        this.linkNode.target = formData.openInNewWindow ? '_blank' : '';

        this.hide();
      },

      onElClicked: function(e) {
        if (e.target == this.$el[0]) {
          this.cancel();
        }
      },

      cancel: function() {
        if (this.linkNode.getAttribute('href') == "http://") {
          // remove the link
          var textNode = document.createTextNode(this.linkNode.innerHTML);
          this.linkNode.parentNode.replaceChild(textNode, this.linkNode);
        }

        this.hide();
      }
    });

    return LinkModal;

  })();

  /*
    Unlink Formatter
    --
    Removes a link from the selected text
  */
  var UnlinkFormatter = SirTrevor.Formatter.extend({
    title: "unlink",
    iconName: "link",
    cmd: "unlink",
    text : "link"
  });

  SirTrevor.Formatters.Link = new LinkFormatter();
  SirTrevor.Formatters.Unlink = new UnlinkFormatter();

})();

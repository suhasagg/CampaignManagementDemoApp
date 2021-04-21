(function() {
  angular
    .module('validation.rule', ['validation'])
    .config(['$validationProvider', function($validationProvider) {
      var expression = {
        required: function(value) {
          return !!value;
        },
        url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
        email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
        number: /^\d+$/,
        minlength: function(value, scope, element, attrs, param) {
          return value.length >= param;
        },
        maxlength: function(value, scope, element, attrs, param) {
          return value.length <= param;
        },
        text:function(value, scope, element, attrs, param){

          var isText = true;
          isText = !(/^\d/.test(value));
          return isText;

        }
      };

      var defaultMsg = {
        required: {
          error: 'Please provide your input!!',
          success: 'It\'s Required'
        },
        url: {
          error: 'Please enter a Url',
          success: 'It\'s Url'
        },
        email: {
          error: 'Please enter a valid Email',
          success: 'It\'s Email'
        },
        number: {
          error: 'Please enter a Number',
          success: 'It\'s Number'
        },
        minlength: {
          error: 'This should be longer',
          success: 'Long enough!'
        },
        maxlength: {
          error: 'This should be shorter',
          success: 'Short enough!'
        },
        text:{
          error:'Please enter only text',
          success:''
        },
        nospace:{
          error:'No space allowed',
          sucess:''
        }
      };
      $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
    }]);
}).call(this);

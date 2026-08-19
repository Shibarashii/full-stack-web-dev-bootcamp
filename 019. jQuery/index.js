$('button').click(() => {
  $('h1').css('color', 'purple');
});

$(document).click(function (e) {
  $('h1').fadeToggle();
});

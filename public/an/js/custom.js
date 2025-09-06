$('.home_hero_slider').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  infinite:true,
  speed:1000,
  arrows:true,
  dots:false
});

$('.home_slider2').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  infinite:true,
  speed:1000,
  arrows:true,
  centerMode: true,
  dots:true
});

$('.network_travel_slider').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  infinite:true,
  speed:1000,
  arrows:true,
  dots:false,
  responsive: [
    {
      breakpoint: 1025,
      settings: {
        slidesToShow: 2,
        arrows:false,
        dots:true
      }
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
        arrows:false,
        dots:true
      }
    }
  ]
});

$('.adventure_post_slide').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  infinite:true,
  speed:1000,
  arrows:false,
  centerMode: false,
  pauseOnHover: true,
  dots:true,
  responsive: [
    {
      breakpoint: 1025,
      settings: {
        slidesToShow: 2,
        arrows:false,
        dots:true
      }
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
        arrows:false,
        dots:true
      }
    }
  ]
});

$('.adv_post_img_slide').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: false,
  autoplaySpeed: 4000,
  infinite:true,
  speed:1000,
  arrows:true,
  dots:false,
  responsive: [
    {
      breakpoint: 1025,
      settings: {
        slidesToShow: 2
      }
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1
      }
    }
  ]
});

$('.adv_guide_slider').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  infinite:true,
  speed:1000,
  arrows:true,
  dots:false,
  responsive: [
    {
      breakpoint: 1025,
      settings: {
        slidesToShow: 2,
        arrows:false,
        dots:true
      }
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
        arrows:false,
        dots:true
      }
    }
  ]
});

$(window).scroll(function() {    
  var scroll = $(window).scrollTop();
  if (scroll >= 50) {
    $("body").addClass("sticky");
  } else {
    $("body").removeClass("sticky");
  }
});

$(document).ready(function(){
  $(".hamburger").click(function(){
    $(this).toggleClass("is_active");
  });
});

$(document).ready(function(){
  $(".hamburger").click(function(){
    $(".nav_menu").toggleClass("open");
  });
});



$(function () {
  $(".faq_box:not(:first-of-type) .answercont").css("display", "none");
  $(".faq_box:first-of-type .question").addClass("open");
  $(".question").click(function () {
    $(".open").not(this).removeClass("open").next().slideUp(300);
    $(this).toggleClass("open").next().slideToggle(300);
  });
});

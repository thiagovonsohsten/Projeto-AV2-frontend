/**
 * Página inicial: link de solicitações (sessão) e carregamento do vídeo YouTube.
 */
document.addEventListener("DOMContentLoaded", function () {
  var link = document.getElementById("link-solicitacao");
  if (link && window.TechServAuth && TechServAuth.isLoggedIn()) {
    link.classList.remove("nav-link--hidden");
  }

  var ytWrap = document.getElementById("youtube-embed-wrap");
  var ytBtn = document.getElementById("btn-carregar-youtube");
  if (ytWrap && ytBtn) {
    var videoId = ytWrap.getAttribute("data-youtube-id") || "jQx6wItPuSo";
    ytBtn.addEventListener("click", function () {
      var src =
        "https://www.youtube-nocookie.com/embed/" +
        videoId +
        "?autoplay=1&rel=0&modestbranding=1";
      ytWrap.classList.remove("video-wrap--facade");
      ytWrap.innerHTML =
        '<iframe src="' +
        src +
        '" title="Vídeo institucional no YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
    });
  }
});

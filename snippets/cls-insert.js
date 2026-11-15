const notice = document.createElement('aside');
notice.className = 'announcement';
// …
document.querySelector('main').before(notice);

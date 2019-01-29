/** Returns entire sidebar element */
function getSidebar() { return document.querySelector('#discussion_bucket .discussion-sidebar'); }

function getSection(section) {
  return getSidebar().querySelector(`.discussion-sidebar-item.sidebar-${section}`);
}

/** Inserts HTML just before the partial sidebar. */
function insertHTML(html) {
  const partialSidebar = getSidebar().querySelector('#partial-discussion-sidebar');
  partialSidebar.insertAdjacentHTML('beforebegin', html);
}

/** Opens the menu and calls the callback once items are rendered. */
function openMenu(section, callback) {
  const sectionEl = getSection(section);
  const headerEl = sectionEl.querySelector('summary.discussion-sidebar-heading');
  const menuEl = sectionEl.querySelector('.select-menu-modal');
  const itemsSelector = '.select-menu-item';

  // Allow any occurring events to finish before performing another click
  setTimeout(() => {
    menuEl.style.opacity = 0; // Hide visible menuEl
    headerEl.click();
  });

  // Listen for menuEl changes and when the labels display, perform callback.
  const menuHolderObserver = new MutationObserver(() => {
    const isDisplayed = window.getComputedStyle(menuEl).display === 'block';
    const hasItems = menuEl.querySelector(itemsSelector);

    if (isDisplayed && hasItems) {
      callback(menuEl);

      // Close menuEl and restore opacity.
      headerEl.click();
      menuEl.style.opacity = 1;

      menuHolderObserver.disconnect();
    }
  });

  menuHolderObserver.observe(menuEl, {characterData: true, attributes: true, subtree: true});
}
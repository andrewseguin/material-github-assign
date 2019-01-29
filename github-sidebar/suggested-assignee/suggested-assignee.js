const SUGGESTED_ASSIGNEE_HTML = `
  <div class="sidebar-section suggested-assignee">
    <div class="section-title">Suggested Assignee</div>
    <div class="options">
      <!-- Add buttons here -->
    </div>
  </div>
`;

const OWNER_NAMES = {
  mmalerba: 'Miles Malerba',
  crisbeto: 'Kristiyan Kostadinov',
  tinayuangao: 'Tina Gao',
  andrewseguin: 'Andrew Seguin',
  josephperrott: 'Joey Perrott',
  jelbourn: 'Jeremy Elbourn',
  devversion: 'Paul Gschwendtner',
};

const OWNERSHIP = {
  'autocomplete': {owner: 'crisbeto', keywords: []},
  'button': {owner: 'tinayuangao', keywords: []},
  'button-toggle': {owner: 'tinayuangao', keywords: []},
  'card': {owner: 'jelbourn', keywords: []},
  'cdk': {owner: 'jelbourn', keywords: []},
  'checkbox': {owner: 'tinayuangao', keywords: []},
  'chips': {owner: 'tinayuangao', keywords: []},
  'datepicker': {owner: 'mmalerba', keywords: []},
  'dialog': {owner: 'crisbeto', keywords: []},
  'expansion': {owner: 'josephperrott', keywords: []},
  'grid-list': {owner: 'tinayuangao', keywords: []},
  'icon': {owner: 'jelbourn', keywords: []},
  'input': {owner: 'mmalerba', keywords: []},
  'list': {owner: 'tinayuangao', keywords: []},
  'menu': {owner: 'crisbeto', keywords: []},
  'overlay': {owner: 'jelbourn', keywords: []},
  'paginator': {owner: 'andrewseguin', keywords: []},
  'portal': {owner: 'jelbourn', keywords: []},
  'radio-button': {owner: 'tinayuangao', keywords: []},
  'ripple': {owner: 'devversion', keywords: []},
  'select': {owner: 'crisbeto', keywords: []},
  'sidenav': {owner: 'mmalerba', keywords: []},
  'slide-toggle': {owner: 'devversion', keywords: []},
  'slider': {owner: 'mmalerba', keywords: []},
  'snackbar': {owner: 'josephperrott', keywords: []},
  'sort': {owner: 'andrewseguin', keywords: []},
  'stepper': {owner: 'mmalerba', keywords: []},
  'table': {owner: 'andrewseguin', keywords: []},
  'tabs': {owner: 'andrewseguin', keywords: []},
  'toolbar': {owner: 'devversion', keywords: []},
  'tooltip': {owner: 'andrewseguin', keywords: []},
  'tree': {owner: 'tinayuangao', keywords: []},
  'typography': {owner: 'crisbeto', keywords: []},
  'virtual': {owner: 'mmalerba', keywords: []},
};

class SuggestedAssignee {
  get suggestedAssigneeSection() { return getSidebar().querySelector('.suggested-assignee'); }

  constructor() {
    // True when a priority button is pushed and has not yet updated the labels.
    this.handlingButtonClick = false;
  }

  addUI() {
    // Do not add if already injected into the HTML
    if (this.suggestedAssigneeSection) {
      return;
    }

    // Inject suggested assignee section
    insertHTML(SUGGESTED_ASSIGNEE_HTML);

    // TODO: Add color to selected assignees like priority label does

    // Add suggested reviewers
    const mentionedComponents = this.getMentionedComponents();
    if (mentionedComponents.length === 0) { this.addNoSuggestedReviewersUI(); }
    this.getMentionedComponents().forEach(c => this.addSuggestedReviewer(c));
  }

  /** Adds UI saying that no reviewers could be suggested. */
  addNoSuggestedReviewersUI() {
    const div = document.createElement('div');
    this.suggestedAssigneeSection.appendChild(div);
    div.textContent = 'No suggestions found';
  }

  /** Adds a suggested reviewer button. */
  addSuggestedReviewer(match) {
    const owner = OWNERSHIP[match].owner;
    const ownerName = OWNER_NAMES[owner];

    const isAlreadyAssigned = getSection('assignee').textContent.indexOf(owner) !== -1;
    if (isAlreadyAssigned) { return; }

    let reviewer;
    this.suggestedAssigneeSection.querySelectorAll('button').forEach(r => {
      if (r.textContent.indexOf(ownerName) !== -1) { reviewer = r; }
    } );
    if (reviewer) {
      reviewer.textContent = reviewer.textContent + ` (${match})`;
      return;
    }

    const button = document.createElement('button');
    this.suggestedAssigneeSection.appendChild(button);
    button.id = owner;
    button.textContent = `${ownerName} (${match})`;

    button.addEventListener('click', () => this.handleButtonClick(button));
  }

  /** Returns the matched components found in the issue discussion. */
  getMentionedComponents() {
    const mentionedComponents = [];

    let comments = '';
    document.querySelectorAll('.discussion-timeline .comment-body')
        .forEach(b => comments += b.textContent);
    comments = comments.toLowerCase();

    Object.keys(OWNERSHIP).forEach(component => {
      const keywords = [component, ...OWNERSHIP[component].keywords];
      const match = keywords.some(k => comments.indexOf(k) !== -1);
      if (match) { mentionedComponents.push(component) }
    });

    return mentionedComponents;
  }

  /** Handle clicks on the priority buttons. */
  handleButtonClick(button) {
    // If already responding to a click, ignore this.
    if (this.handlingButtonClick) { return; }
    this.handlingButtonClick = true;

    // Open the labels menu and when the labels display, click the appropriate priority label.
    openMenu('assignee', menu => {
      this.getAssigneeMenuItem(menu, button.id).click(); // Apply assignee

      // Remove suggested reviewer
      button.remove();

      this.handlingButtonClick = false;
    });
  }

  /** Gets the menu item that has the username contained. */
  getAssigneeMenuItem(menu, id) {
    const usernames = menu.querySelectorAll('.js-username');
    for (let i = 0; i < usernames.length; i++) {
      if (usernames[i].textContent === id) {
        return usernames[i].closest('.select-menu-item');
      }
    }
  }
}

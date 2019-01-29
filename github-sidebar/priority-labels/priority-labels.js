const PRIORITY_LABELS_HTML = `
  <div class="sidebar-section priority-labels">
    <div class="section-title">Priority</div>
    <div class="options">
      <button id="P0">P0</button>
      <button id="P1">P1</button>
      <button id="P2">P2</button>
      <button id="P3">P3</button>
      <button id="P4">P4</button>
      <button id="P5">P5</button>
    </div>
  </div>
`;

class PriorityLabels {
  /** Gets the DOM's inserted priority buttons. */
  get buttons() { return getSidebar().querySelectorAll('.priority-labels button'); }

  /** List of the applied labels for the issue. */
  get appliedLabels() { return getSection('labels').querySelectorAll('.labels a'); }

  constructor() {
    // True when a priority button is pushed and has not yet updated the labels.
    this.handlingButtonClick = false;
  }

  addUI() {
    // Do not add if already injected into the HTML
    if (this.buttons.length > 0) { return; }

    // Listen for changes in the sidebar and update the priority colors with the updated info
    new MutationObserver(() => this.updatePriorityColors())
        .observe(getSidebar(), {attributes: true, childList: true, characterData: true});

    // Insert the HTML (beneficial side effect: causes a change so that colors update)
    insertHTML(PRIORITY_LABELS_HTML);

    // Listen for clicks on the priority buttons
    this.buttons.forEach(b => b.addEventListener('click', () => this.handleButtonClick(b)));
  }

  /** Handle clicks on the priority buttons. */
  handleButtonClick(button) {
    // If already responding to a click, ignore this.
    if (this.handlingButtonClick) { return; }
    this.handlingButtonClick = true;

    // Immediately toggle the color of the priority button
    button.classList.toggle(`selected-${button.id}`);

    // Open the labels menu and when the labels display, click the appropriate priority label.
    openMenu('labels', (menu) => {
      menu.querySelector(`[data-label-name="${button.id}"]`).click();
      this.handlingButtonClick = false;
    });
  }

  /**
   * Looks at the issue's list of priority labels and syncs the injected
   * buttons to their selected state.
   */
  updatePriorityColors() {
    // Mutation may have been one that removes the DOM
    if (!getSidebar()) { return; }

    const selectedPriorities = new Set();
    this.appliedLabels.forEach(b => selectedPriorities.add(b.textContent));

    this.buttons.forEach(button => {
      if (selectedPriorities.has(button.id)) {
        button.classList.add(`selected-${button.id}`);
      } else {
        button.classList.remove(`selected-${button.id}`);
      }
    })
  }
}

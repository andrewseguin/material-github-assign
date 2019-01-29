function main() {
  const location = window.location.href;

  const isMaterial2 = location.indexOf('https://github.com/angular/material2') === 0;
  //const isMaterial2 = location.indexOf('https://github.com/andrewseguin/hello-world') === 0;

  if (isMaterial2) {
    const isIssuesPage = location.indexOf('/issues/') !== -1;
    if (isIssuesPage) {
      const priorityLabels = new PriorityLabels();
      priorityLabels.addUI();

      const suggestedAssignee = new SuggestedAssignee();
      suggestedAssignee.addUI();
    }
  }
}

//document.body.addEventListener('pjax:end', main);
main();

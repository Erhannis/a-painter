document.currentScript.parentElement.addEventListener('requestforui', function addUi ({detail:{uiEl}}) {
    let UI = HandMenu;

    let brushes = [...Array(100).keys()].map(i => UI.UiButton({text:`${i+1}`}));

    let pagesUi = UI.UiRoot(
      UI.FoldLayout({},
        UI.PageLayout({autodistribute:true,gridparams:{cols:3,rows:5}},
          ...brushes
        ),
        UI.UiText({text:"Middle"}),
        UI.UiText({text:"Right"})
      )
    );

    uiEl.appendChild(pagesUi);
  });

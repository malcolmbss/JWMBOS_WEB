function toggleSubMenu(parentId) {
  tagUid = getTagUidFromName("menu_" + parentId);
  document.getElementById("nextViewIcon" + tagUid).click();
  return false;
}

/* TODO IMPLIMENT A SOLID MOUSEOVER MOUSELEAVE EVENT */

// function openSubMenu(parentId) {
//    const tagUid = getTagUidFromName( "menu_" + parentId );
//    document.getElementById( "viewIcon" + tagUid + "_1").click();
// }

// function closeSubMenu(parentId) {
//    const tagUid = getTagUidFromName( "menu_" + parentId );
//    document.getElementById( "viewIcon" + tagUid + "_0").click();
// }

// document.getElementByClassName('menu_1').addEventListener('mouseEnter', () => {
//    openSubMenu(parentId);
// });

// Drop down closer on menu item click
function createCloser() {
  var check1 = document.getElementById("officeCheck 4").checked;
  var check2 = document.getElementById("officeCheck 6").checked;

  if (check2 && check1) {
    document.getElementById("officeCheck 2").checked = false;
    document.getElementById("officeCheck 4").checked = false;
  } else if (check1) {
    document.getElementById("officeCheck 2").checked = false;
  } else if (check2) {
    document.getElementById("officeCheck 4").checked = false;
  } else {
    return;
  }
}

let myLeads = [];
const inputElement = document.querySelector('.input');
const saveInputBtn = document.querySelector('.save-input-btn');
const saveTabBtn = document.querySelector('.save-tab-btn');
const deleteBtn = document.querySelector('.delete-btn');
const ulEl = document.querySelector('.ul-el');
const leadsHistory = document.querySelector('.first-li');
const leadsFromLocalStorage = JSON.parse(localStorage.getItem('myLeads'));
const dialog = document.querySelector('.confirm-delete');

// Get leads from localStorage
if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage
  renderLeads()
}

// Display leads in the UI
function renderLeads() {
  let ulLists = ''

  for (let i = 0; i < myLeads.length; i++) {
    ulLists += `
      <li>
        <a target="_blank" href="${myLeads[i]}">
          ${myLeads[i]}
        </a>
      </li>
    `;
  }

   // If no leads, show a message
   if (myLeads.length === 0) {
    ulEl.innerHTML = `<li class="no-leads-msg">You have no leads stored.</li>`;
  } else {
    ulEl.innerHTML = ulLists;
  }
}

// Display leads when leadsHistory is clicked
if (leadsHistory) {
  leadsHistory.addEventListener('click', (e) => {
    e.stopPropagation();

    if (ulEl.style.display === 'block') {
        ulEl.style.display = 'none'
    } else {
      ulEl.style.display = 'block';
    }
  });

// Close leads when you click outside of it
document.addEventListener('click', (e) => {
  if (e.target !== leadsHistory && !ulEl.contains(e.target))
    {
      ulEl.style.display = 'none';
    }
  });
}

// Save leads to localStorage
saveInputBtn.addEventListener('click', () => {
  const inputValue = inputElement.value.trim();
  if (inputValue) {
    myLeads.unshift(inputValue);
    inputElement.value = ''
    localStorage.setItem('myLeads', JSON.stringify(myLeads))
    renderLeads()
  }
})

// Delete leads when deleteBtn is clicked
deleteBtn.addEventListener('click', (e) => {
  e.stopPropagation();

  const yesDel = document.querySelector('.yes-del');
  const noDel = document.querySelector('.no-del');

  dialog.showModal()

 
  noDel.addEventListener('click', () => {
    dialog.close()
  })


  yesDel.addEventListener('click', () => {
    localStorage.clear()
    myLeads = []
    renderLeads()
    dialog.close()
  })
});

// Close dialog when clicking outside it
document.addEventListener('click', (e) => {
  if (!dialog.contains(e.target) && dialog.hasAttribute('open')) {
    dialog.close();
  }
});

// Save the link to the current tab you are on to localStorage
saveTabBtn.addEventListener("click", function(){    
  chrome.tabs.query({
    active: true, 
    currentWindow: true
  }, function(tabs) {
      myLeads.unshift(tabs[0].url)
      localStorage.setItem('myLeads', JSON.stringify(myLeads))
      renderLeads()
  })
})
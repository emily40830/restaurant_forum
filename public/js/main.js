// const change_role = document.getElementById('toggle-change-role');

// change_role.addEventListener('change', () => {
//   console.log(event);
//   $('#change-modal').modal('show');
// });
const confirmModal = (userid) => {
  $(`#change-modal-${userid}`).modal('show');
};

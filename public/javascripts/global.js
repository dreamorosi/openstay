//Userlist data array to put in the page
var userListData = [];

$(document).ready(function(){
  populateTable();
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
  $('#search').on('keyup', 'input', debounce(searchUser, 300));
});

function populateTable(data) {
  var tableContent = '';
  if(data!=undefined){
    $.each(data, function(){
      userListData = data;
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td>' + this.fullname + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });
    $('#userList table tbody').html(tableContent);
  }else{
    $.getJSON('/users/userlist', function(data){
      $.each(data, function(){
        userListData = data;
        tableContent += '<tr>';
        tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
        tableContent += '<td>' + this.email + '</td>';
        tableContent += '<td>' + this.fullname + '</td>';
        tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
        tableContent += '</tr>';
      });

      $('#userList table tbody').html(tableContent);
    });
  }
}

function showUserInfo(e) {
    e.preventDefault();
    var thisUserName = $(this).attr('rel');
    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);
    var thisUserObject = userListData[arrayPosition];
    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
}

function deleteUser(e){
  e.preventDefault();
  var confirmation = confirm('Are you sure you want to delete this user?');
  if(!confirmation) return false;
  $.ajax({
    type: 'DELETE',
    url: '/users/deleteuser/' + $(this).attr('rel')
  }).done(function( response ) {
    // Check for a successful (blank) response
    if (response.msg !== '') {
      alert('Error: ' + response.msg);
      return false;
    }
    populateTable();
  });
}

function searchUser(){
  if($.trim($('#search input').val())!=''){
    $.get('/users/search/'+$.trim($('#search input').val()), function(data){
      populateTable(data);
    });
  }else{
    populateTable();
  }
}

function debounce(fn, bufferInterval) {
    var timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(searchUser, bufferInterval);
    };

}

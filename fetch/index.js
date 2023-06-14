const usersContainer = document.querySelector('.users-container');

async function fetchUsers() {
    const response = await fetch(
        'https://random-data-api.com/api/v2/users?size=12'
    );
    const users = await response.json();


    users.forEach((user) => {
		addUsersToPage(user)
    });


}


function addUsersToPage(user) {
    let userCard = `<div class="user-card-container">
						<div class="user-card">
							<div class="avatar">
								<div class="img-container">
									<img
										src="${user.avatar}"
										alt=""
									/>
								</div>
							</div>

							<div class="user-details">
								<div class="username">${user.username}</div>
								<div class="name">
									${user.first_name + ' ' + user.last_name}
								</div>
								<div class="email">${user.email}</div>
								<div class="country">${user.address.country}</div>
								<div class="job">${user.employment.title}</div>
							</div>
						</div>
					</div>`;

	usersContainer.insertAdjacentHTML('afterbegin', userCard)
}


fetchUsers();

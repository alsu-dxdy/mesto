class UserInfo {
    constructor(form, username, job, avatar) {
        this.form = form;
        this.username = username;
        this.job = job;
        this.avatar = avatar;
    }

    setUserInfo() {
        this.form.username.value = this.username.textContent;
        this.form.job.value = this.job.textContent;
    }


    updateUserInfo(data) {
        this.username.textContent = data.name;
        this.job.textContent = data.about;
    }

    updateUserAvatar(data) {
        this.avatar.style.backgroundImage = `url(${data.avatar})`;
    }

}
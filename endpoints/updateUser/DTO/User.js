class User {
    constructor(user) {
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.phone_number = user.phone_number
            ? user.phone_number.replace(/[\s()-]/g, "")
            : "";
        this.user_email = user.user_email;
        this.user_role = user.user_role;
        this.ocr_tool_id = user.ocr_tool_id;
        this.is_active = user.is_active;
    }
}

export default User;

class User {
    constructor(item) {
        this.first_name = item.first_name;
        this.last_name = item.last_name;
        this.phone_number = item.phone_number.replace(/[\s()-]/g, "");
        this.user_email = item.user_email;
        this.user_role = item.user_role;
        this.ocr_tool_id = item.ocr_tool_id;
    }
}

export default User;

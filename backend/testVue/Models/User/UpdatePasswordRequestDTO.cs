﻿namespace testVue.Models.User
{
    public class UpdatePasswordRequestDTO
    {
        public string Email { get; set; } = string.Empty;       
        public string NewPassword { get; set; } = string.Empty;
    }
}

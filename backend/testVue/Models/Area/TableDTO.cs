﻿using System.ComponentModel.DataAnnotations;

namespace testVue.Models.Area
{
    public class TableDTO
    {
        [Key]
        public int TableId { get; set; } = default;
        public string TableName { get; set; } = string.Empty;
    }
}

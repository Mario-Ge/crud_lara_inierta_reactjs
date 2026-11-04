<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Elektronik',
                'description' => 'Produk elektronik dan perangkat teknologi.',
            ],
            [
                'name' => 'Aksesori',
                'description' => 'Aksesori dan perlengkapan pendukung.',
            ],
            [
                'name' => 'Perlengkapan Rumah',
                'description' => 'Peralatan dan kebutuhan rumah tangga.',
            ],
            [
                'name' => 'Pakaian',
                'description' => 'Pakaian dan kebutuhan sandang.',
            ],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['name' => $category['name']],
                ['description' => $category['description']]
            );
        }
    }
}

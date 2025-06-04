<?php

namespace Database\Seeders;

use App\Models\Bungalow;
use App\Models\Amenity;
use Illuminate\Database\Seeder;

class BungalowSeeder extends Seeder
{
    public function run(): void
    {
        $bungalows = [
            [
                'name' => 'Garnaal',
                'description' => 'us ut non a etiam mattis. Non est vestibulum eu elit nunc consequat. Nibh convallis hac eget vitae scelerisque vitae morbi tortor. Dignissim et mi justo lectus nisl massa. Ut aliquam pellentesque hendrerit iaculis ac sed condimentum vulputate. Elementum mauris id sollicitudin aliquam diam hendrerit. Laoreet ultrices tempor enim massa diam viverra. Felis a nec odio ipsum porta ac vel pharetra in. Dignissim consectetur tincidunt a eget arcu. Id pretium facilisis adipiscing nisl aliquet. Ipsum tristique at diam pellentesque platea massa. Feugiat suspendisse nam sollicitudin vitae neque nunc et varius donec. Sit quis blandit eget netus augue a mauris. Accumsan quam adipiscing massa justo enim eros eu duis. Pretium tristique arcu in feugiat arcu pellentesque.',
                'price' => 100.00,
                'image' => '/mask-group.png',
                'images' => json_encode(['/mask-group.png', '/mask-group.png', '/mask-group.png']),
                'persons' => 4,
                'bedrooms' => 2,
            ],
            [
                'name' => 'Krab',
                'description' => 'us ut non a etiam mattis. Non est vestibulum eu elit nunc consequat. Nibh convallis hac eget vitae scelerisque vitae morbi tortor. Dignissim et mi justo lectus nisl massa. Ut aliquam pellentesque hendrerit iaculis ac sed condimentum vulputate. Elementum mauris id sollicitudin aliquam diam hendrerit. Laoreet ultrices tempor enim massa diam viverra. Felis a nec odio ipsum porta ac vel pharetra in. Dignissim consectetur tincidunt a eget arcu. Id pretium facilisis adipiscing nisl aliquet. Ipsum tristique at diam pellentesque platea massa. Feugiat suspendisse nam sollicitudin vitae neque nunc et varius donec. Sit quis blandit eget netus augue a mauris. Accumsan quam adipiscing massa justo enim eros eu duis. Pretium tristique arcu in feugiat arcu pellentesque.',
                'price' => 120.00,
                'image' => '/mask-group-1.png',
                'images' => json_encode(['/mask-group-1.png', '/mask-group-1.png', '/mask-group-1.png']),
                'persons' => 6,
                'bedrooms' => 3,
            ],
            [
                'name' => 'Kreeft',
                'description' => 'us ut non a etiam mattis. Non est vestibulum eu elit nunc consequat. Nibh convallis hac eget vitae scelerisque vitae morbi tortor. Dignissim et mi justo lectus nisl massa. Ut aliquam pellentesque hendrerit iaculis ac sed condimentum vulputate. Elementum mauris id sollicitudin aliquam diam hendrerit. Laoreet ultrices tempor enim massa diam viverra. Felis a nec odio ipsum porta ac vel pharetra in. Dignissim consectetur tincidunt a eget arcu. Id pretium facilisis adipiscing nisl aliquet. Ipsum tristique at diam pellentesque platea massa. Feugiat suspendisse nam sollicitudin vitae neque nunc et varius donec. Sit quis blandit eget netus augue a mauris. Accumsan quam adipiscing massa justo enim eros eu duis. Pretium tristique arcu in feugiat arcu pellentesque.',
                'price' => 150,
                'image' => '/mask-group-2.png',
                'images' => json_encode(['/mask-group-2.png', '/mask-group-2.png', '/mask-group-2.png']),
                'persons' => 8,
                'bedrooms' => 3,
            ]
        ];

        foreach ($bungalows as $data) {
            $bungalow = Bungalow::create($data);
            $bungalow->amenities()->attach(Amenity::inRandomOrder()->limit(2)->pluck('id'));
        }
    }
}
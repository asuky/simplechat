<?php

namespace App\Http\Controllers;

use App\Room;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    // GET /room/{roomid}
    // 部屋の存在を確認、ある場合はその状態を返す
    public function readRoomStatus(Request $request, $id)
    {
        // status について
        // 0: 部屋自体が存在しない
        // 1: 部屋はあり、Offer SDP 待機
        // 2: Offer SDP 揃い、Answer 側の参加待機
        // 3: Answer 側の参加要求あり、Answer SDP 待機
        // 4: Answer SDP 揃い

        // そもそも期限の切れているデータについては削除
        // （ベタ書き1800秒は後で直す）
        Room::where('created_at', '<', date('Y-m-d H:i-s', time()-1800))->delete();

        // 指定された room id が存在しない場合はその旨返す
        if (is_null($roomData = Room::where('room_name', $id)->first())) {
            return response()->json([
                'error' => false,
                'status' => 0
            ], 200);
        }
        
        // 1: 部屋はあり、Offer SDP 待機 のとき
        // A側の nick を返す
        if ($roomData->status === 1) {
            return response()->json([
                'error' => false,
                'status' => 1,
                'nickname' => $roomData->a_nick
            ], 200);
        }
        // 2: Offer SDP 揃い、Answer 側の参加待機 のとき
        // A側の Offer SDP を返す
        if ($roomData->status === 2) {
            return response()->json([
                'error' => false,
                'status' => 2,
                'nickname' => $roomData->a_nick,
                'sdp' => $roomData->a_sdp
            ], 200);
        }
        // 3: Answer 側の参加要求あり、Answer SDP 待機 のとき
        // B側の nickを返す
        if ($roomData->status === 3) {
            return response()->json([
                'error' => false,
                'status' => 3,
                'nickname' => $roomData->b_nick
            ], 200);
        }
        // 4: Answer SDP 揃い のとき
        // B側の Answer SDP を返す
        if ($roomData->status === 4) {
            return response()->json([
                'error' => false,
                'status' => 4,
                'nickname' => $roomData->b_nick,
                'sdp' => $roomData->b_sdp
            ], 200);
        }

        // 上に合致しないときはエラー
        return response()->json([
            'error' => true,
            'status' => -1
        ], 400);

    }

    // POST /room/{roomid}
    // 指定された roomid を作成する
    public function createRoomStatus(Request $request, $id)
    {
        // 指定された room id が存在しない場合は作成する
        // 必要な validation を後で書くこと
        if (is_null($roomData = Room::where('room_name', $id)->first())) {
            $room = Room::create([
                'status' => 1,
                'room_name' => $id,
                'a_nick' => $request->nickname
            ]);

            return response()->json([
                'error' => false,
                'id' => $room->id
            ], 201);
        }

        // すでに存在する場合はエラー
        return response()->json([
            'error' => false
        ], 403);
    }

    // PUT /room/{roomid}
    // 部屋の情報を更新する
    public function updateRoomStatus(Request $request, $id)
    {
        // 指定された room id が存在しない場合は404を返す
        if (is_null($roomData = Room::where('room_name', $id)->first())) {
            return response()->json([
                'error' => false
            ], 404);
        }

        // room id が存在し、 status が 1 の場合は sdp を update
        if ($roomData->status === 1) {
            $room = Room::where('room_name', $id)
                    ->update([
                        'status' => 2,
                        'a_sdp' => $request->sdp
                    ]);
        }

        //　status が 2 の場合は b_nick を update
        if ($roomData->status === 2) {
            $room = Room::where('room_name', $id)
                    ->update([
                        'status' => 3,
                        'b_nick' => $request->nickname
                    ]);
        }

        // room id が存在し、 status が 3 の場合は b_sdp を update
        if ($roomData->status === 3) {
            $room = Room::where('room_name', $id)
                    ->update([
                        'status' => 4,
                        'b_sdp' => $request->sdp
                    ]);
        }

        return response()->json([
            'error' => false
        ], 200);
    }
}